'use strict';
// Registration with an emailed 6-digit code, login, profile, logout from all devices.
const config = require('../config');
const { one, run } = require('../db');
const { route, fail } = require('../router');
const S = require('../security');
const { deliverCode } = require('../notify');

const FACULTIES = ['technology', 'engineering', 'business'];
const LANGS = ['kk', 'ru', 'en'];
const now = () => Date.now();

function publicUser(u) {
  return {
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    phone: u.phone,
    faculty: u.faculty,
    group: u.group_name,
  };
}

function session(user) {
  run("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", user.id);
  return { token: S.signToken(user), user: publicUser(user) };
}

// Brute-force protection per IP
function limit(ctx, name, max, minutes) {
  const wait = S.rateLimit(`${name}:${ctx.ip}`, max, minutes * 60000);
  if (wait) fail(429, 'too_many_requests', { retryIn: wait });
}

function emailOf(body) {
  const email = S.normalizeEmail(body.email);
  if (!email) fail(400, 'bad_email');
  return email;
}

// Creates a code, sends it and returns delivery info. Cooldown and hourly cap per user.
async function issueCode(user) {
  const last = one('SELECT created_at FROM verification_codes WHERE user_id = ? ORDER BY id DESC LIMIT 1', user.id);
  if (last) {
    const wait = Math.ceil((last.created_at + config.code.resendSec * 1000 - now()) / 1000);
    if (wait > 0) fail(429, 'code_cooldown', { retryIn: wait });
  }
  const sentLastHour = one('SELECT COUNT(*) AS n FROM verification_codes WHERE user_id = ? AND created_at > ?', user.id, now() - 3600000).n;
  if (sentLastHour >= config.code.maxPerHour) fail(429, 'code_hour_limit', { retryIn: 3600 });

  const code = S.newCode();
  // Older unused codes stop working once a new one is issued
  run('UPDATE verification_codes SET used_at = ? WHERE user_id = ? AND used_at IS NULL', now(), user.id);
  const row = run(
    'INSERT INTO verification_codes (user_id, code_hash, expires_at, created_at) VALUES (?, ?, ?, ?)',
    user.id, S.hashCode(code), now() + config.code.ttlMin * 60000, now()
  );
  let delivered;
  try {
    ({ delivered } = await deliverCode(user.email, code, user.lang));
  } catch (e) {
    console.error('Email delivery failed:', e.message);
    run('DELETE FROM verification_codes WHERE id = ?', row.lastInsertRowid);
    fail(502, 'email_send_failed');
  }
  return {
    sentTo: S.maskEmail(user.email),
    resendIn: config.code.resendSec,
    ttlMin: config.code.ttlMin,
    ...(delivered ? {} : { demoCode: code }),
  };
}

// Checks the code: limited attempts, expiry, single use
function consumeCode(user, code) {
  if (!/^\d{6}$/.test(String(code || ''))) fail(400, 'bad_code');
  const row = one('SELECT * FROM verification_codes WHERE user_id = ? AND used_at IS NULL ORDER BY id DESC LIMIT 1', user.id);
  if (!row) fail(400, 'code_missing');
  if (row.expires_at < now()) fail(400, 'code_expired');
  if (row.attempts >= config.code.maxAttempts) fail(400, 'code_attempts');
  if (!S.sameCode(code, row.code_hash)) {
    run('UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?', row.id);
    const left = config.code.maxAttempts - row.attempts - 1;
    fail(400, left > 0 ? 'code_wrong' : 'code_attempts', { attemptsLeft: Math.max(0, left) });
  }
  run('UPDATE verification_codes SET used_at = ? WHERE id = ?', now(), row.id);
}

route('GET', '/api/health', () => ({ ok: true, demo: !config.mailEnabled }));

route('POST', '/api/auth/register', async (ctx) => {
  limit(ctx, 'register', 10, 15);
  const b = ctx.body;
  const email = emailOf(b);
  const phone = S.normalizePhone(b.phone);
  if (!S.validName(b.firstName) || !S.validName(b.lastName)) fail(400, 'bad_name');
  if (!phone) fail(400, 'bad_phone');
  if (!FACULTIES.includes(b.faculty)) fail(400, 'bad_faculty');
  if (!S.validGroup(b.group)) fail(400, 'bad_group');
  const pwProblem = S.passwordProblem(b.password);
  if (pwProblem) fail(400, pwProblem);
  const lang = LANGS.includes(b.lang) ? b.lang : 'kk';
  const fields = [
    String(b.firstName).trim(), String(b.lastName).trim(), phone, b.faculty,
    String(b.group).trim().toUpperCase(), S.hashPassword(b.password), lang,
  ];

  let user = one('SELECT * FROM users WHERE email = ?', email);
  if (user && user.verified) fail(409, 'email_taken');
  if (user) {
    // Unfinished registration: keep the newest details and send a fresh code
    run('UPDATE users SET first_name = ?, last_name = ?, phone = ?, faculty = ?, group_name = ?, password_hash = ?, lang = ? WHERE id = ?', ...fields, user.id);
  } else {
    const r = run('INSERT INTO users (first_name, last_name, phone, faculty, group_name, password_hash, lang, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', ...fields, email);
    user = { id: Number(r.lastInsertRowid) };
  }
  user = one('SELECT * FROM users WHERE id = ?', user.id);
  try {
    return { pending: true, email, ...(await issueCode(user)) };
  } catch (e) {
    // A code was sent moments ago (double tap, going back and forth): reuse it
    if (e.code !== 'code_cooldown') throw e;
    return { pending: true, email, sentTo: S.maskEmail(email), resendIn: e.extra.retryIn, ttlMin: config.code.ttlMin };
  }
});

route('POST', '/api/auth/verify', (ctx) => {
  limit(ctx, 'verify', 30, 15);
  const user = one('SELECT * FROM users WHERE email = ?', emailOf(ctx.body));
  if (!user) fail(400, 'code_missing');
  if (user.verified) fail(409, 'already_verified');
  consumeCode(user, ctx.body.code);
  run('UPDATE users SET verified = 1 WHERE id = ?', user.id);
  return session(one('SELECT * FROM users WHERE id = ?', user.id));
});

route('POST', '/api/auth/resend', async (ctx) => {
  limit(ctx, 'resend', 10, 15);
  const user = one('SELECT * FROM users WHERE email = ?', emailOf(ctx.body));
  if (!user || user.verified) fail(400, 'code_missing');
  return issueCode(user);
});

route('POST', '/api/auth/login', async (ctx) => {
  limit(ctx, 'login', 15, 15);
  const email = S.normalizeEmail(ctx.body.email);
  const user = email && one('SELECT * FROM users WHERE email = ?', email);
  if (!user || !S.checkPassword(ctx.body.password, user.password_hash)) fail(401, 'bad_credentials');
  if (!user.verified) {
    // Correct password but never confirmed: send a code so the app can open the code screen
    let info = {};
    try {
      info = await issueCode(user);
    } catch (e) {
      if (e.code !== 'code_cooldown') throw e;
      info = { resendIn: e.extra.retryIn };
    }
    fail(403, 'not_verified', { email, ...info });
  }
  return session(user);
});

route('GET', '/api/me', (ctx) => ({ user: publicUser(ctx.user) }), { auth: true });

route('POST', '/api/auth/logout-all', (ctx) => {
  run('UPDATE users SET token_version = token_version + 1 WHERE id = ?', ctx.user.id);
}, { auth: true });
