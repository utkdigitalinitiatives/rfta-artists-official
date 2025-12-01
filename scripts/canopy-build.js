const config = require("../canopy.config");
const canopy = require("../services/canopy");

const env = {
    ...config.globals,
    ...config.prod,
};

(async () => {
    try {
        console.log("Building Canopy data files...");
        await canopy.buildCanopy(env);
        console.log("Canopy build complete!");
    } catch (error) {
        console.error("Error building Canopy:", error);
        process.exit(1);
    }
})();
