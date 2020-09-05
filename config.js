module.exports = {
  development: {
    port: process.env.DEV_PORT || 3100,
  },
  production: {
    port: process.env.PRO_PORT || 8083,
  },
};