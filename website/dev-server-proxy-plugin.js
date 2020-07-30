const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function () {
  return {
    name: 'dev-server-proxy-plugin',
    configureWebpack(config) {
      if (process.env.NODE_ENV === 'production') {
        return {};
      }

      return {
        devServer: {
          ...config.devServer,
          after: function (app) {
            app.use(
              '/1/indexes/:aestrik/queries',
              createProxyMiddleware({
                target: 'http://localhost:3001',
                changeOrigin: true,
              }),
            );
          },
        },
      };
    },
  };
};
