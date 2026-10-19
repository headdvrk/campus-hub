'use strict';
// Campus Hub auth server: JSON API under /api for the Expo app. Run: node server/index.js
const http = require('http');
const config = require('./config');
require('./db');
require('./routes/auth');
const { handle } = require('./router');

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  const url = new URL(req.url, 'http://localhost');

  // CORS only for the Expo web origins in CORS_ORIGINS; the native app sends no Origin
  const origin = req.headers.origin;
  if (origin && config.corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }
  if (url.pathname.startsWith('/api/')) return handle(req, res, url);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(config.port, () => {
  const mail = config.mailWebhook.url
    ? 'Apps Script relay'
    : config.mailEnabled ? `SMTP ${config.smtp.host}` : 'DEMO (codes in console and on screen)';
  console.log(`\n  ${config.appName} API → http://localhost:${config.port}/api`);
  console.log(`  Email: ${mail}\n`);
});
