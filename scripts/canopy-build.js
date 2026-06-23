const config = require("../canopy.config");
const canopy = require("../services/canopy");
const fs = require("fs");

const env = {
  ...config.globals,
  ...config.prod,
};

(async () => {
  try {
    console.log("Building Canopy data files...");
    await canopy.buildCanopy(env);
    const manifests = JSON.parse(
      fs.readFileSync(".canopy/manifests.json", "utf8"),
    );
    const metadata = JSON.parse(
      fs.readFileSync(".canopy/metadata.json", "utf8"),
    );
    console.log(`Canopy manifests: ${manifests.length}`);
    console.log(`Canopy metadata rows: ${metadata.length}`);
    console.log("Canopy build complete!");
  } catch (error) {
    if (error?.message) {
      console.error(`Canopy build error message: ${error.message}`);
    }
    console.error("Error building Canopy:", error);
    process.exit(1);
  }
})();
