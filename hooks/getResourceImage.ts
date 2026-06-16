import { normalizeIiifUrl } from "@/hooks/normalizeIiifUrl";

export const getResourceImage = (resource, size = "600,", region = "full") => {
  if (Array.isArray(resource)) resource = resource[0];

  const image = normalizeIiifUrl(resource.id);

  if (!resource.service) return image;

  if (!Array.isArray(resource.service)) {
    if (resource.service["@id"])
      return `${normalizeIiifUrl(resource.service["@id"])}/${region}/${size}/0/default.jpg`;

    if (resource.service.id)
      return `${normalizeIiifUrl(resource.service.id)}/${region}/${size}/0/default.jpg`;
  }

  if (resource.service[0]["@id"])
    return `${normalizeIiifUrl(resource.service[0]["@id"])}/${region}/${size}/0/default.jpg`;

  return `${normalizeIiifUrl(resource.service[0].id)}/${region}/${size}/0/default.jpg`;
};
