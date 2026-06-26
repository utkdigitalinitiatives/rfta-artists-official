const {
  buildCanopyCollection,
  getBulkManifests,
  getRootCollection,
  getValues,
} = require("./build");
const fs = require("fs");
const slugify = require("slugify");
const { writeFile } = fs.promises;

const normalizeIiifUrl = (value) => {
  if (!value || typeof value !== "string") return value;
  return value.replace(
    /http:\/\/digital\.lib\.utk\.edu/gi,
    "https://digital.lib.utk.edu",
  );
};

module.exports.buildCanopy = async (env) => {
  const json = await getRootCollection(env.collection);

  const canopyDirectory = ".canopy";

  console.log(`Generating collection data...`);
  const canopyCollection = buildCanopyCollection(json, 0, null);

  try {
    if (!fs.existsSync(canopyDirectory)) {
      fs.mkdirSync(canopyDirectory);
    }
  } catch (err) {
    console.error(err);
  }

  await writeFile(
    `${canopyDirectory}/collections.json`,
    JSON.stringify([canopyCollection]),
  );

  console.log(`Creating manifest listing...`);
  const canopyManifests = canopyCollection.items
    .filter((item) => item?.type === "Manifest")
    .map((item) => ({
      collectionId: normalizeIiifUrl(item.parent),
      id: normalizeIiifUrl(item.id),
      label: item.label,
      slug: slugify(item.label[0], env.slugify),
    }));

  await writeFile(
    `${canopyDirectory}/manifests.json`,
    JSON.stringify(canopyManifests),
  );

  console.log(`Flattening prescribed metadata...`);
  const manifests = await getBulkManifests(canopyManifests, 5);

  const canopyMetadata = [];
  manifests
    .filter((manifest) => manifest && Array.isArray(manifest.metadata))
    .forEach((manifest) => {
      manifest.metadata.forEach((metadata) => {
        const metadataLabel = getValues(metadata.label)?.[0];
        const metadataValues = getValues(metadata.value) || [];

        if (!metadataLabel || !env.metadata.includes(metadataLabel)) return;

        metadataValues.forEach((value) => {
          canopyMetadata.push({
            manifestId: normalizeIiifUrl(manifest.id),
            label: metadataLabel,
            value,
            thumbnail: normalizeIiifUrl(manifest.thumbnail?.[0]?.id),
          });
        });
      });
    });

  await writeFile(
    `${canopyDirectory}/metadata.json`,
    JSON.stringify(canopyMetadata),
  );
};
