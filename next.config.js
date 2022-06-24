const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

const config = require("./canopy.config");
const canopy = require("./services/canopy");

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isProd = phase === PHASE_PRODUCTION_BUILD;

  const { prod, dev } = config;

  config.environment = (() => {
    if (isDev) return dev;
    if (isProd) return prod;
  })();

  const env = {
    ...config.globals,
    ...config.environment,
  };

  canopy.buildCanopy(env);
  return { env };
};

module.exports = {
  async headers() {
    return [
      {
        // match all Gotham routes
        source: "/public/fonts/Gotham/*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};
