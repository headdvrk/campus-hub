'use strict';
// Checks the built-in SMTP client against a local fake TLS SMTP server: node server/tests/smtp.test.js
// Needs openssl (comes with Git for Windows) to create a throwaway certificate.
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const tls = require('tls');
const assert = require('assert');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-smtp-'));
const key = path.join(dir, 'key.pem');
const cert = path.join(dir, 'cert.pem');
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert,
  '-days', '1', '-subj', '/CN=localhost'], { stdio: 'ignore' });

const PORT = 4465;
Object.assign(process.env, {
  SMTP_HOST: 'localhost', SMTP_PORT: String(PORT), SMTP_SECURE: 'true', SMTP_USER: 'bot@example.com',
  SMTP_PASS: 'app-pass', MAIL_FROM: 'Campus Hub <bot@example.com>', MAIL_WEBHOOK_URL: '', JWT_SECRET: 'test',
});
// Only for this test: trust the throwaway self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { sendMail } = require('../notify');

const log = [];
const server = tls.createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(cert) }, (sock) => {
  let inData = false;
  let body = '';
  let buf = '';
  const say = (s) => sock.write(s + '\r\n');
  say('220 fake.smtp ready');
  sock.on('data', (chunk) => {
    buf += chunk.toString();
    let i;
    while ((i = buf.indexOf('\r\n')) >= 0) {
      const line = buf.slice(0, i);
      buf = buf.slice(i + 2);
      if (inData) {
        if (line === '.') {
          inData = false;
          log.push({ body });
          say('250 queued');
        } else body += line + '\n';
        continue;
      }
      log.push({ cmd: line });
      if (/^EHLO/.test(line)) sock.write('250-fake.smtp\r\n250 AUTH LOGIN\r\n');
      else if (line === 'AUTH LOGIN') say('334 VXNlcm5hbWU6');
      else if (Buffer.from(line, 'base64').toString() === 'bot@example.com') say('334 UGFzc3dvcmQ6');
      else if (Buffer.from(line, 'base64').toString() === 'app-pass') say('235 ok');
      else if (/^(MAIL FROM|RCPT TO)/.test(line)) say('250 ok');
      else if (line === 'DATA') {
        inData = true;
        say('354 go');
      } else if (line === 'QUIT') {
        say('221 bye');
        sock.end();
      } else say('500 unknown');
    }
  });
});

server.listen(PORT, async () => {
  try {
    await sendMail('student@example.com', 'Поштаны растау: 123456', '<b>123456</b>');
    const cmds = log.filter((l) => l.cmd).map((l) => l.cmd);
    assert(cmds.includes('MAIL FROM:<bot@example.com>'));
    assert(cmds.includes('RCPT TO:<student@example.com>'));
    const body = log.find((l) => l.body).body;
    assert.match(body, /Subject: =\?UTF-8\?B\?/);
    const html = Buffer.from(body.split('\n\n').slice(1).join('').replace(/\s/g, ''), 'base64').toString('utf8');
    assert.strictEqual(html, '<b>123456</b>');
    console.log('smtp: all checks passed');
  } catch (e) {
    console.error('FAIL', e.message, '\nSMTP log:', log.map((l) => l.cmd ?? '<body>').join(' | '));
    process.exitCode = 1;
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
