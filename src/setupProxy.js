const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/v2/competitions",
    createProxyMiddleware({
      target: "https://api.cricket-data.org",
      changeOrigin: true,
    })
  );
};
