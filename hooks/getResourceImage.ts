import { normalizeIiifUrl } from "@/services/iiif-url";

const ISLANDORA_DATASTREAM_RE =
  /\/collections\/islandora\/object\/([^/]+)\/datastream\/(OBJ|JPG|TN)\b/i;

const toIiifImageApiUrl = (url, region, size) => {
  if (!url) return url;

  const match = url.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return url;

  const [, objectId, datastream] = match;
  const decodedObjectId = decodeURIComponent(objectId);
  const imageDatastream =
    datastream.toUpperCase() === "OBJ" ? "JPG" : datastream.toUpperCase();

  return `https://digital.lib.utk.edu/iiif/2/collections~islandora~object~${decodedObjectId}~datastream~${imageDatastream}/${region}/${size}/0/default.jpg`;
};

const toImageProxyUrl = (url) => {
  if (!url || !url.includes("digital.lib.utk.edu")) return url;
  return `/api/image?src=${encodeURIComponent(url)}`;
};

export const getResourceImage = (resource, size = "600,", region = "full") => {
  if (!resource) return null;
  if (Array.isArray(resource)) resource = resource[0];

  let image = normalizeIiifUrl(resource.id);

  if (!resource.service) {
    // Avoid raw datastream URLs, which can be blocked by browser ORB.
    return toImageProxyUrl(toIiifImageApiUrl(image, region, size));
  }

  if (!Array.isArray(resource.service)) {
    if (resource.service["@id"])
      return toImageProxyUrl(
        normalizeIiifUrl(
          `${resource.service["@id"]}/${region}/${size}/0/default.jpg`,
        ),
      );

    if (resource.service.id)
      return toImageProxyUrl(
        normalizeIiifUrl(
          `${resource.service.id}/${region}/${size}/0/default.jpg`,
        ),
      );
  }

  if (resource.service[0]["@id"])
    return toImageProxyUrl(
      normalizeIiifUrl(
        `${resource.service[0]["@id"]}/${region}/${size}/0/default.jpg`,
      ),
    );

  return toImageProxyUrl(
    normalizeIiifUrl(
      `${resource.service[0].id}/${region}/${size}/0/default.jpg`,
    ),
  );
};
