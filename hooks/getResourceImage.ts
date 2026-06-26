import { normalizeIiifUrl, toIiifImageApiUrl } from "@/services/iiif-url";

export const getResourceImage = (resource, size = "600,", region = "full") => {
  if (!resource) return null;
  if (Array.isArray(resource)) resource = resource[0];

  let image = normalizeIiifUrl(resource.id);

  if (!resource.service) {
    // Prefer IIIF Image API URLs over raw datastream URLs for browser compatibility.
    return toIiifImageApiUrl(image, region, size);
  }

  if (!Array.isArray(resource.service)) {
    if (resource.service["@id"])
      return normalizeIiifUrl(
        `${resource.service["@id"]}/${region}/${size}/0/default.jpg`,
      );

    if (resource.service.id)
      return normalizeIiifUrl(
        `${resource.service.id}/${region}/${size}/0/default.jpg`,
      );
  }

  if (resource.service[0]["@id"])
    return normalizeIiifUrl(
      `${resource.service[0]["@id"]}/${region}/${size}/0/default.jpg`,
    );

  return normalizeIiifUrl(
    `${resource.service[0].id}/${region}/${size}/0/default.jpg`,
  );
};
