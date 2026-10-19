'use strict';
// Password hashing (scrypt), JWT (HS256), one-time codes, input validation, rate limiting.
const crypto = require('crypto');
const config = require('./config');

// ---- passwords: only a salted scrypt hash is stored ----
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function checkPassword(password, stored) {
  const [alg, saltHex, hashHex] = String(stored).split('$');
  if (alg !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(String(password), Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

// ---- JWT: token_version (tv) lets the server revoke all tokens of a user ----
const hmac = (data) => crypto.createHmac('sha256', config.jwtSecret).update(data);

function signToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    tv: user.token_version,
    exp: Math.floor(Date.now() / 1000) + config.tokenDays * 86400,
  })).toString('base64url');
  return `${header}.${payload}.${hmac(`${header}.${payload}`).digest('base64url')}`;
}

function readToken(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  const expected = hmac(`${parts[0]}.${parts[1]}`).digest();
  const given = Buffer.from(parts[2], 'base64url');
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

// ---- one-time codes: stored only as an HMAC, compared in constant time ----
const newCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');
const hashCode = (code) => hmac(`code:${code}`).digest('hex');

function sameCode(code, storedHash) {
  const a = Buffer.from(hashCode(code), 'hex');
  const b = Buffer.from(String(storedHash), 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---- validation (mirrors src/utils/validation.ts in the app) ----
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const normalizeEmail = (email) => (EMAIL_RE.test(String(email || '').trim()) ? String(email).trim().toLowerCase() : null);

// Kazakhstan numbers (+7 7XX): "8 707 123 45 67" → "+7 707 123 45 67"; otherwise null
function normalizePhone(input) {
  let d = String(input || '').replace(/\D/g, '');
  if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1);
  if (d.length === 10) d = '7' + d;
  if (!/^77\d{9}$/.test(d)) return null;
  return `+7 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9)}`;
}

const validName = (s) => /^[\p{L}][\p{L} '\-]{1,39}$/u.test(String(s || '').trim());
const validGroup = (s) => /^[\p{L}\d][\p{L}\d\-]{1,11}$/u.test(String(s || '').trim());

function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 8) return 'weak_password';
  if (password.length > 128) return 'weak_password';
  if (!/\p{L}/u.test(password) || !/\d/.test(password)) return 'weak_password';
  return null;
}

function maskEmail(email) {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(1, Math.min(user.length - 2, 5)))}@${domain}`;
}

// ---- rate limiting: in-memory counter per key and time window ----
const buckets = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    bucket = { count: 0, reset: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count++;
  return bucket.count <= max ? 0 : Math.ceil((bucket.reset - now) / 1000);
}
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.reset < now) buckets.delete(key);
}, 60000).unref();

module.exports = {
  hashPassword, checkPassword, signToken, readToken, newCode, hashCode, sameCode,
  normalizeEmail, normalizePhone, validName, validGroup, passwordProblem, maskEmail, rateLimit,
};
