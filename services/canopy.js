const {
  buildCanopyCollection,
  getBulkManifests,
  getRootCollection,
  getValues,
} = require("./build");
const fs = require("fs").promises;
const fsSync = require("fs");
const slugify = require("slugify");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getFirstPageUrl = (json) => {
  if (!json || typeof json !== "object") return null;
  const first = json.first;
  if (!first) return null;
  if (typeof first === "string") return first;
  if (typeof first === "object") return first.id || first["@id"] || null;
  return null;
};

const fetchRootCollectionWithRetry = async (sourceUrl, attempts = 4) => {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const json = await getRootCollection(sourceUrl);
      let canopyCollection = buildCanopyCollection(json, 0, null);
      let itemCount = Array.isArray(canopyCollection?.items)
        ? canopyCollection.items.length
        : 0;

      // Some IIIF servers return a paged root collection shell.
      if (itemCount === 0) {
        const firstPageUrl = getFirstPageUrl(json);
        if (firstPageUrl) {
          const firstPageJson = await getRootCollection(firstPageUrl);
          const firstPageCollection = buildCanopyCollection(
            firstPageJson,
            0,
            null,
          );
          const firstPageCount = Array.isArray(firstPageCollection?.items)
            ? firstPageCollection.items.length
            : 0;

          if (firstPageCount > 0) {
            return {
              canopyCollection: firstPageCollection,
              source: `${sourceUrl} -> ${firstPageUrl}`,
            };
          }
        }
      }

      if (itemCount > 0) {
        return {
          canopyCollection,
          source: sourceUrl,
        };
      }

      const keys =
        json && typeof json === "object"
          ? Object.keys(json).slice(0, 12).join(",")
          : typeof json;
      lastError = new Error(
        `Attempt ${attempt}/${attempts}: root collection had no items (keys: ${keys}).`,
      );
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) {
      console.warn(
        `Retrying canopy root collection fetch (${attempt}/${attempts}) for ${sourceUrl}...`,
      );
      await delay(750 * attempt);
    }
  }

  throw (
    lastError || new Error(`Failed to fetch root collection from ${sourceUrl}`)
  );
};

module.exports.buildCanopy = async (env) => {
  /**
   * set directory to write canopy structure to
   */
  const canopyDirectory = ".canopy";

  /**
   * generate collection data
   */
  console.log(`Generating collection data...`);
  const { canopyCollection, source } = await fetchRootCollectionWithRetry(
    env.collection,
  );
  console.log(`Canopy collection source: ${source}`);

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
