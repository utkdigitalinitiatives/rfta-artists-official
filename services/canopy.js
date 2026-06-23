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
      JSON.stringify([canopyCollection])
    );
  } catch (err) {
    console.error("Error writing collections.json:", err);
    throw err;
  }

  /**
   * create manifest listing
   */
  console.log(`Creating manifest listing...`);
  const canopyManifests = canopyCollection.items.map((item) => {
    /**
     * what should label look like at this point?
     * language for label?
     * are they unique?
     */
    if (item.type === "Manifest")
      return {
        collectionId: item.parent,
        id: item.id,
        label: item.label,
        slug: slugify(item.label[0], env.slugify),
      };
  });

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

  const getManifestThumbnail = (manifest) => {
    if (!manifest) return null;

    const v3Thumbnail = Array.isArray(manifest.thumbnail)
      ? manifest.thumbnail[0]
      : manifest.thumbnail;

    if (v3Thumbnail?.id) return v3Thumbnail.id;
    if (v3Thumbnail?.["@id"]) return v3Thumbnail["@id"];

    const v3Body = manifest?.items?.[0]?.items?.[0]?.items?.[0]?.body;
    if (v3Body?.id) return v3Body.id;
    if (v3Body?.["@id"]) return v3Body["@id"];

    const v2Resource = manifest?.sequences?.[0]?.canvases?.[0]?.images?.[0]?.resource;
    if (v2Resource?.id) return v2Resource.id;
    if (v2Resource?.["@id"]) return v2Resource["@id"];

    return null;
  };

  const normalizeManifestId = (id) =>
    typeof id === "string" ? id.replace(/^http:\/\//i, "https://") : id;

  const manifestsById = new Map(
    manifests
      .filter(Boolean)
      .map((manifest) => [normalizeManifestId(manifest.id), manifest])
  );

  const canopyManifestsWithThumbnails = canopyManifests.map((manifest) => {
    const fullManifest = manifestsById.get(normalizeManifestId(manifest.id));

    return {
      ...manifest,
      thumbnail: getManifestThumbnail(fullManifest),
    };
  });

  try {
    await fs.writeFile(
      `${canopyDirectory}/manifests.json`,
      JSON.stringify(canopyManifestsWithThumbnails)
    );
  } catch (err) {
    console.error("Error writing manifests.json:", err);
    throw err;
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
      })
    );

  try {
    await fs.writeFile(
      `${canopyDirectory}/metadata.json`,
      JSON.stringify(canopyMetadata)
    );
  } catch (err) {
    console.error("Error writing metadata.json:", err);
    throw err;
  }
};
