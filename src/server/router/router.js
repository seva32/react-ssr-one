const { createProxyMiddleware } = require('http-proxy-middleware');

export default (app) => {
  app.use(
    '/api/**',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      router(_req) {
        return {
          protocol: 'http:', // The : is required
          host: 'localhost',
          port: 3000,
        };
      },
      logLevel: 'debug',
      onProxyReq(proxyReq, req, _res) {
        // add custom header to request
        proxyReq.setHeader('x-added', 'foobar');
        console.log(req.body);
      },
    }),
  );
};
