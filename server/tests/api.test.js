'use strict';
// End-to-end API check in demo mode on a throwaway database: node server/tests/api.test.js
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const PORT = 3999;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-api-'));
const server = spawn(process.execPath, [path.join(__dirname, '..', 'index.js')], {
  env: { ...process.env, PORT: String(PORT), DB_FILE: path.join(dir, 'test.db'), JWT_SECRET: 'test-secret',
    SMTP_HOST: '', MAIL_WEBHOOK_URL: '', DEV_SHOW_CODES: 'true' },
  stdio: ['ignore', 'pipe', 'inherit'],
});

async function api(method, url, body, token) {
  const res = await fetch(`http://localhost:${PORT}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}

const student = {
  firstName: 'Нұрбек', lastName: 'Қазбек', email: 'Nurbek@Example.com', phone: '8 707 123 45 67',
  faculty: 'technology', group: 'пи-24-1к', password: 'secret123', lang: 'kk',
};

async function main() {
  await new Promise((resolve) => server.stdout.on('data', (d) => /API/.test(d) && resolve()));
  let r;

  r = await api('POST', '/api/auth/register', { ...student, password: 'short' });
  assert.deepStrictEqual([r.status, r.data.error], [400, 'weak_password']);
  r = await api('POST', '/api/auth/register', { ...student, phone: '+7 916 123 45 67' });
  assert.deepStrictEqual([r.status, r.data.error], [400, 'bad_phone']);
  r = await api('POST', '/api/auth/register', { ...student, faculty: 'law' });
  assert.deepStrictEqual([r.status, r.data.error], [400, 'bad_faculty']);

  r = await api('POST', '/api/auth/register', student);
  assert.strictEqual(r.status, 200);
  assert.match(r.data.demoCode, /^\d{6}$/);
  assert.strictEqual(r.data.email, 'nurbek@example.com');
  const code = r.data.demoCode;

  r = await api('POST', '/api/auth/login', { email: student.email, password: student.password });
  assert.deepStrictEqual([r.status, r.data.error], [403, 'not_verified']);
  r = await api('POST', '/api/auth/resend', { email: student.email });
  assert.deepStrictEqual([r.status, r.data.error], [429, 'code_cooldown']);

  const wrong = code === '000000' ? '111111' : '000000';
  r = await api('POST', '/api/auth/verify', { email: student.email, code: wrong });
  assert.deepStrictEqual([r.status, r.data.error, r.data.attemptsLeft], [400, 'code_wrong', 4]);
  r = await api('POST', '/api/auth/verify', { email: student.email, code });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.data.user.group, 'ПИ-24-1К');
  assert.strictEqual(r.data.user.phone, '+7 707 123 45 67');
  const token = r.data.token;

  r = await api('POST', '/api/auth/verify', { email: student.email, code });
  assert.deepStrictEqual([r.status, r.data.error], [409, 'already_verified']);
  r = await api('POST', '/api/auth/register', student);
  assert.deepStrictEqual([r.status, r.data.error], [409, 'email_taken']);

  r = await api('POST', '/api/auth/login', { email: student.email, password: 'wrong-pass1' });
  assert.deepStrictEqual([r.status, r.data.error], [401, 'bad_credentials']);
  r = await api('POST', '/api/auth/login', { email: 'NURBEK@example.com', password: student.password });
  assert.strictEqual(r.status, 200);

  r = await api('GET', '/api/me', null, token);
  assert.strictEqual(r.data.user.firstName, 'Нұрбек');
  r = await api('GET', '/api/me', null, token + 'x');
  assert.strictEqual(r.status, 401);
  r = await api('POST', '/api/auth/logout-all', null, token);
  assert.strictEqual(r.status, 200);
  r = await api('GET', '/api/me', null, token);
  assert.strictEqual(r.status, 401, 'old tokens must stop working after logout-all');

  const stored = fs.readFileSync(path.join(dir, 'test.db')).toString('latin1');
  assert(!stored.includes('secret123'), 'password must not be stored in plain text');
  console.log('api: all checks passed');
}

main()
  .catch((e) => {
    console.error('FAIL', e.message);
    process.exitCode = 1;
  })
  .finally(() => {
    server.kill();
    setTimeout(() => fs.rmSync(dir, { recursive: true, force: true }), 300);
  });
