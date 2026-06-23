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

  // Netlify already runs `npm run canopy:build` before `next build`.
  // Rebuilding here can fail on transient upstream 500s and break deploys.
  if (isDev) {
    canopy.buildCanopy(env).catch((error) => {
      console.error("Canopy build failed in dev mode:", error?.message || error);
    });
  }

  return { env };
};
