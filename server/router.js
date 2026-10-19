'use strict';
// Minimal JSON router. A handler returns the response body; errors are thrown with
// fail(status, code) and sent as {error: code}, which the app turns into a translated message.
const { readToken } = require('./security');
const { one } = require('./db');

class HttpError extends Error {
  constructor(status, code, extra) {
    super(code);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}
const fail = (status, code, extra) => {
  throw new HttpError(status, code, extra);
};

const routes = [];
function route(method, path, handler, opts = {}) {
  routes.push({ method, path, handler, opts });
}

function readBody(req, limit = 100_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new HttpError(413, 'too_large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!size) return resolve({});
      try {
        const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        resolve(value && typeof value === 'object' && !Array.isArray(value) ? value : {});
      } catch {
        reject(new HttpError(400, 'bad_json'));
      }
    });
    req.on('error', reject);
  });
}

// User behind the Bearer token; the token dies when token_version changes or the account is gone
function authUser(req) {
  const header = req.headers.authorization || '';
  const payload = header.startsWith('Bearer ') ? readToken(header.slice(7)) : null;
  if (!payload) return null;
  const user = one('SELECT * FROM users WHERE id = ?', payload.sub);
  if (!user || !user.verified || user.token_version !== payload.tv) return null;
  return user;
}

async function handle(req, res, url) {
  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(body));
  };
  const samePath = routes.filter((r) => r.path === url.pathname);
  const match = samePath.find((r) => r.method === req.method);
  if (!samePath.length) return send(404, { error: 'not_found' });
  if (!match) return send(405, { error: 'method_not_allowed' });

  try {
    const ctx = {
      req,
      ip: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress,
      body: req.method === 'POST' ? await readBody(req) : {},
    };
    if (match.opts.auth) {
      ctx.user = authUser(req);
      if (!ctx.user) fail(401, 'unauthorized');
    }
    const out = await match.handler(ctx);
    send(200, out === undefined ? { ok: true } : out);
  } catch (e) {
    if (e instanceof HttpError) return send(e.status, { error: e.code, ...(e.extra || {}) });
    console.error(e);
    send(500, { error: 'server_error' });
  }
}

module.exports = { route, handle, fail };
