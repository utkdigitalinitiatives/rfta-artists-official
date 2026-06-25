const config = require("../canopy.config");
const canopy = require("../services/canopy");
const fs = require("fs");
const path = require("path");

const env = {
    ...config.globals,
    ...config.prod,
};

const REQUIRED_CANOPY_FILES = [
    "collections.json",
    "manifests.json",
    "metadata.json",
];

const restoreCanopyFromCache = () => {
    const cacheDir = path.join(process.cwd(), "canopy-cache");
    const canopyDir = path.join(process.cwd(), ".canopy");

    const cacheExists = REQUIRED_CANOPY_FILES.every((file) =>
        fs.existsSync(path.join(cacheDir, file)),
    );

    if (!cacheExists) return false;

    if (!fs.existsSync(canopyDir)) {
        fs.mkdirSync(canopyDir, { recursive: true });
    }

    REQUIRED_CANOPY_FILES.forEach((file) => {
        fs.copyFileSync(path.join(cacheDir, file), path.join(canopyDir, file));
    });

    return true;
};

(async () => {
    try {
        console.log("Building Canopy data files...");
        await canopy.buildCanopy(env);
        console.log("Canopy build complete!");
    } catch (error) {
        const isNetlify = process.env.NETLIFY === "true";
        if (isNetlify && restoreCanopyFromCache()) {
            console.warn("Canopy build blocked upstream; restored cached canopy files from canopy-cache/.");
            return;
        }

        console.error("Error building Canopy:", error);
        process.exit(1);
    }
})();
