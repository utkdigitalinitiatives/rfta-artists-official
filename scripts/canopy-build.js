const config = require("../canopy.config");
const canopy = require("../services/canopy");

const env = {
  ...config.globals,
  ...config.prod,
};

console.log("Building Canopy data files...");
canopy.buildCanopy(env);

// Give async operations time to complete
setTimeout(() => {
  console.log("Canopy build complete!");
  process.exit(0);
}, 10000);
