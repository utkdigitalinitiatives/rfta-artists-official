const {
  buildCanopyCollection,
  getBulkManifests,
  getRootCollection,
  getValues,
} = require("./build");
const fs = require("fs");
const fsp = fs.promises;
const slugify = require("slugify");

const normalizeIiifUrl = (value) => {
  if (!value || typeof value !== "string") return value;
  return value.replace(/http:\/\/digital\.lib\.utk\.edu/gi, "https://digital.lib.utk.edu");
};

module.exports.buildCanopy = async (env) => {
  const canopyDirectory = ".canopy";
  const json = await getRootCollection(env.collection);

  console.log(`Generating collection data...`);
  const canopyCollection = buildCanopyCollection(json, 0, null);

  await fsp.mkdir(canopyDirectory, { recursive: true });

  await fsp.writeFile(
    `${canopyDirectory}/collections.json`,
    JSON.stringify([canopyCollection]),
  );

  console.log(`Creating manifest listing...`);
  const canopyManifests = canopyCollection.items
    .filter((item) => item.type === "Manifest")
    .map((item) => ({
      collectionId: normalizeIiifUrl(item.parent),
      id: normalizeIiifUrl(item.id),
      label: item.label,
      slug: slugify(item.label[0], env.slugify),
    }));

  await fsp.writeFile(
    `${canopyDirectory}/manifests.json`,
    JSON.stringify(canopyManifests),
  );

  await fsp.writeFile(`${canopyDirectory}/metadata.json`, JSON.stringify([]));

  console.log(`Flattening prescribed metadata...`);
  const manifests = await getBulkManifests(canopyManifests, 25);
  const canopyMetadata = [];

  manifests
    .filter((manifest) => manifest)
    .forEach((manifest) => {
      manifest.metadata.forEach((metadata) => {
        const metadataLabel = getValues(metadata.label)[0];
        const metadataValues = getValues(metadata.value);
        if (env.metadata.includes(metadataLabel)) {
          metadataValues.forEach((value) => {
            canopyMetadata.push({
              manifestId: normalizeIiifUrl(manifest.id),
              label: metadataLabel,
              value,
              thumbnail: normalizeIiifUrl(manifest.thumbnail[0].id),
            });
          });
        }
      });
    });

  await fsp.writeFile(
    `${canopyDirectory}/metadata.json`,
    JSON.stringify(canopyMetadata),
  );
};
