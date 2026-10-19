'use strict';
// Reads server/.env (KEY=VALUE lines) into process.env and exposes typed settings.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

const env = (key, fallback = '') => process.env[key] || fallback;

// Without JWT_SECRET a random one is generated once and kept in data/, so restarts keep sessions.
function jwtSecret() {
  if (env('JWT_SECRET')) return env('JWT_SECRET');
  const file = path.join(ROOT, 'data', '.jwt-secret');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, crypto.randomBytes(48).toString('hex'));
  return fs.readFileSync(file, 'utf8').trim();
}

const config = {
  port: Number(env('PORT', '3000')),
  appName: env('APP_NAME', 'Campus Hub · ALT University'),
  dbFile: path.resolve(ROOT, env('DB_FILE', 'data/campus.db')),
  jwtSecret: jwtSecret(),
  tokenDays: Number(env('TOKEN_DAYS', '30')),
  // Origins of the Expo web app allowed to call the API (native apps send no Origin)
  corsOrigins: env('CORS_ORIGINS', 'http://localhost:8081,http://localhost:8082,http://localhost:19006')
    .split(',').map((s) => s.trim()).filter(Boolean),
  code: { ttlMin: 10, resendSec: 60, maxAttempts: 5, maxPerHour: 6 },
  smtp: {
    host: env('SMTP_HOST'),
    port: Number(env('SMTP_PORT', '465')),
    // TLS from the first byte (465); otherwise STARTTLS is required (587)
    secure: env('SMTP_SECURE') ? /^(1|true|yes)$/i.test(env('SMTP_SECURE')) : env('SMTP_PORT', '465') === '465',
    user: env('SMTP_USER'),
    pass: env('SMTP_PASS'),
    from: env('MAIL_FROM', env('SMTP_USER')),
  },
  // HTTPS relay (deploy/mail-relay.gs) for hosts that block SMTP ports, e.g. Render free tier
  mailWebhook: { url: env('MAIL_WEBHOOK_URL'), secret: env('MAIL_WEBHOOK_SECRET') },
  // Demo: when email is not configured, the code is printed and returned to the app
  devCodes: !/^(0|false|no)$/i.test(env('DEV_SHOW_CODES', 'true')),
};

config.mailEnabled = Boolean(
  config.mailWebhook.url || (config.smtp.host && config.smtp.user && config.smtp.pass)
);

module.exports = config;
