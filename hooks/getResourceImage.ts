import { normalizeIiifUrl } from "@/services/iiif-url";

export const getResourceImage = (resource, size = "600,", region = "full") => {
  if (!resource) return null;
  if (Array.isArray(resource)) resource = resource[0];

  let image = normalizeIiifUrl(resource.id);

  if (!resource.service) {
    // Fallback to the TN datastream when a IIIF service is unavailable.
    if (image?.includes("/datastream/OBJ")) {
      return image.replace("/datastream/OBJ", "/datastream/TN");
    }
    return image;
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
