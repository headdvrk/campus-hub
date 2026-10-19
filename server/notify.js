'use strict';
// Sends the verification email: over SMTP (TLS on 465 or STARTTLS on 587) or through the
// Google Apps Script relay (deploy/mail-relay.gs). No third-party packages.
const net = require('net');
const tls = require('tls');
const os = require('os');
const crypto = require('crypto');
const config = require('./config');

// Line-based SMTP conversation: each command waits for the final "NNN text" reply line
function smtpSession(socket) {
  let buffer = '';
  let waiter = null;
  let sock = socket;

  const onData = (chunk) => {
    buffer += chunk.toString('utf8');
    const lines = buffer.split('\r\n');
    for (let i = 0; i < lines.length - 1; i++) {
      if (/^\d{3}( |$)/.test(lines[i])) {
        const reply = lines.slice(0, i + 1).join('\n');
        buffer = lines.slice(i + 1).join('\r\n');
        const w = waiter;
        waiter = null;
        if (w) w.resolve({ code: Number(reply.slice(0, 3)), text: reply });
        return;
      }
    }
  };
  const onError = (err) => {
    const w = waiter;
    waiter = null;
    if (w) w.reject(err);
  };
  const attach = (s) => {
    s.on('data', onData);
    s.on('error', onError);
    s.setTimeout(20000, () => onError(new Error('SMTP timeout')));
  };
  attach(sock);

  const read = () =>
    new Promise((resolve, reject) => {
      waiter = { resolve, reject };
      onData(Buffer.alloc(0));
    });

  return {
    read,
    async cmd(line, expect) {
      const reply = read();
      sock.write(line + '\r\n');
      const r = await reply;
      if (expect && !expect.includes(r.code)) throw new Error(`SMTP ${line.split(' ')[0]} failed: ${r.text}`);
      return r;
    },
    upgrade(host) {
      return new Promise((resolve, reject) => {
        sock.removeListener('data', onData);
        const secure = tls.connect({ socket: sock, servername: host }, resolve);
        secure.on('error', reject);
        sock = secure;
        attach(secure);
      });
    },
    end() {
      sock.end();
    },
  };
}

const encodeHeader = (s) => `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`;

async function sendViaRelay(to, subject, html) {
  const res = await fetch(config.mailWebhook.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: config.mailWebhook.secret, to, subject, html, name: config.appName }),
    signal: AbortSignal.timeout(20000),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`Mail relay failed: ${res.status} ${data.error || ''}`);
}

async function sendMail(to, subject, html) {
  if (config.mailWebhook.url) return sendViaRelay(to, subject, html);

  const { host, port, secure, user, pass, from } = config.smtp;
  const socket = await new Promise((resolve, reject) => {
    const s = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    s.once(secure ? 'secureConnect' : 'connect', () => resolve(s));
    s.once('error', reject);
  });
  const smtp = smtpSession(socket);
  try {
    const greeting = await smtp.read();
    if (greeting.code !== 220) throw new Error('SMTP greeting: ' + greeting.text);
    const ehlo = `EHLO ${os.hostname().replace(/[^a-z0-9.-]/gi, '') || 'localhost'}`;
    const caps = await smtp.cmd(ehlo, [250]);
    if (!secure) {
      // Never send the password over a plain connection
      if (!/STARTTLS/i.test(caps.text)) throw new Error('SMTP server does not offer STARTTLS');
      await smtp.cmd('STARTTLS', [220]);
      await smtp.upgrade(host);
      await smtp.cmd(ehlo, [250]);
    }
    await smtp.cmd('AUTH LOGIN', [334]);
    await smtp.cmd(Buffer.from(user).toString('base64'), [334]);
    await smtp.cmd(Buffer.from(pass).toString('base64'), [235]);

    const fromAddr = (from.match(/<([^>]+)>/) || [null, from])[1];
    await smtp.cmd(`MAIL FROM:<${fromAddr}>`, [250]);
    await smtp.cmd(`RCPT TO:<${to}>`, [250, 251]);
    await smtp.cmd('DATA', [354]);
    const body = Buffer.from(html, 'utf8').toString('base64').replace(/.{76}/g, '$&\r\n');
    const message = [
      `From: ${encodeHeader(config.appName)} <${fromAddr}>`,
      `To: <${to}>`,
      `Subject: ${encodeHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@${fromAddr.split('@')[1] || 'localhost'}>`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      body,
    ].join('\r\n');
    await smtp.cmd(message + '\r\n.', [250]);
    await smtp.cmd('QUIT').catch(() => {});
  } finally {
    smtp.end();
  }
}

const TEXT = {
  kk: { title: 'Поштаны растау', label: 'Тіркелуді растау коды', note: (m) => `Код ${m} минут жарамды. Егер сіз тіркелмеген болсаңыз, бұл хатты елемеңіз.` },
  ru: { title: 'Подтверждение почты', label: 'Код подтверждения регистрации', note: (m) => `Код действителен ${m} минут. Если вы не регистрировались, просто проигнорируйте письмо.` },
  en: { title: 'Confirm your email', label: 'Your sign-up confirmation code', note: (m) => `The code is valid for ${m} minutes. If you did not sign up, ignore this email.` },
};

function emailHtml(code, lang) {
  const t = TEXT[lang];
  return `<!doctype html><html><body style="margin:0;background:#EEF3FA;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="100%" style="max-width:460px;background:#ffffff;border-radius:20px;padding:32px" cellpadding="0" cellspacing="0">
<tr><td style="font-size:20px;font-weight:bold;color:#005DAC">Campus Hub · ALT University</td></tr>
<tr><td style="padding-top:20px;font-size:18px;color:#091A2C;font-weight:bold">${t.title}</td></tr>
<tr><td style="padding-top:8px;font-size:14px;color:#3D4756">${t.label}:</td></tr>
<tr><td style="padding:20px 0;font-size:34px;letter-spacing:10px;font-weight:bold;color:#091A2C">${code}</td></tr>
<tr><td style="font-size:13px;color:#3D4756;line-height:1.5">${t.note(config.code.ttlMin)}</td></tr>
</table></td></tr></table></body></html>`;
}

// Returns {delivered:true}, or {delivered:false} in demo mode (email not configured)
async function deliverCode(email, code, lang) {
  lang = TEXT[lang] ? lang : 'kk';
  if (!config.mailEnabled) {
    if (!config.devCodes) throw new Error('Email is not configured');
    console.log(`[DEMO] verification code for ${email}: ${code}`);
    return { delivered: false };
  }
  await sendMail(email, `${TEXT[lang].title}: ${code}`, emailHtml(code, lang));
  return { delivered: true };
}

module.exports = { deliverCode, sendMail };
