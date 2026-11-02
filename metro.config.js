const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

const previousMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const next = previousMiddleware
    ? previousMiddleware(middleware, server)
    : middleware;

  return (req, res, nextHandler) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    next(req, res, nextHandler);
  };
};

module.exports = config;