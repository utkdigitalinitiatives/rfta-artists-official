const {
  buildCanopyCollection,
  getBulkManifests,
  getRootCollection,
  getValues,
} = require("./build");
const fs = require("fs").promises;
const fsSync = require("fs");
const slugify = require("slugify");

module.exports.buildCanopy = async (env) => {
  const json = await getRootCollection(env.collection);

  /**
   * set directory to write canopy structure to
   */
  const canopyDirectory = ".canopy";

  /**
   * generate collection data
   */
  console.log(`Generating collection data...`);
  const canopyCollection = buildCanopyCollection(json, 0, null);

  if (
    !canopyCollection ||
    !Array.isArray(canopyCollection.items) ||
    canopyCollection.items.length === 0
  ) {
    throw new Error(
      `Canopy root collection returned no items. Source: ${env.collection}`,
    );
  }

  try {
    if (!fsSync.existsSync(canopyDirectory)) {
      fsSync.mkdirSync(canopyDirectory);
    }
  } catch (err) {
    console.error("Error creating .canopy directory:", err);
    throw err;
  }

  try {
    await fs.writeFile(
      `${canopyDirectory}/collections.json`,
      JSON.stringify([canopyCollection]),
    );
  } catch (err) {
    console.error("Error writing collections.json:", err);
    throw err;
  }

  /**
   * create manifest listing
   */
  console.log(`Creating manifest listing...`);
  const canopyManifests = canopyCollection.items
    .filter((item) => item.type === "Manifest")
    .map((item) => ({
      collectionId: item.parent,
      id: item.id,
      label: item.label,
      slug: slugify(item.label[0], env.slugify),
    }));

  if (canopyManifests.length === 0) {
    throw new Error(`Canopy manifest list is empty. Source: ${env.collection}`);
  }

  try {
    await fs.writeFile(
      `${canopyDirectory}/manifests.json`,
      JSON.stringify(canopyManifests),
    );
  } catch (err) {
    console.error("Error writing manifests.json:", err);
    throw err;
  }

  /**
   * flatten metadata
   */
  console.log(`Flattening prescribed metadata...`);

  let manifests;
  try {
    manifests = await getBulkManifests(canopyManifests, 25);
  } catch (err) {
    console.error("Error fetching manifests:", err);
    throw err;
  }

  if (!Array.isArray(manifests) || manifests.length === 0) {
    throw new Error(
      `No manifests were fetched from canopy manifest listing. Source: ${env.collection}`,
    );
  }

  let canopyMetadata = [];
  manifests
    .filter((manifest) => {
      if (manifest) return manifest;
    })
    .map((manifest) =>
      manifest.metadata.forEach((metadata) => {
        const metadataLabel = getValues(metadata.label)[0];
        const metadataValues = getValues(metadata.value);
        if (env.metadata.includes(metadataLabel)) {
          metadataValues.forEach((value) => {
            const result = {
              manifestId: manifest.id,
              label: metadataLabel,
              value,
              thumbnail: manifest.thumbnail[0].id,
            };
            canopyMetadata.push(result);
          });
        }
      }),
    );

  try {
    await fs.writeFile(
      `${canopyDirectory}/metadata.json`,
      JSON.stringify(canopyMetadata),
    );
  } catch (err) {
    console.error("Error writing metadata.json:", err);
    throw err;
  }
};
