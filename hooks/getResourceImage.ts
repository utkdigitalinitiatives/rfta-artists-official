type IIIFResourceLike = {
  id?: string;
  "@id"?: string;
  service?: IIIFServiceLike | IIIFServiceLike[];
};

type IIIFServiceLike = {
  id?: string;
  "@id"?: string;
};

type ResourceInput =
  | string
  | IIIFResourceLike
  | Array<string | IIIFResourceLike>
  | null
  | undefined;

const normalizeUrl = (value?: string): string | undefined =>
  typeof value === "string" ? value.replace(/^http:\/\//i, "https://") : value;

const normalizeDatastreamFallback = (value?: string): string | undefined => {
  if (typeof value !== "string") return value;

  // If a manifest points to an OBJ datastream (often TIFF), use the TN derivative for cards.
  if (value.includes("/datastream/OBJ")) {
    return value.replace("/datastream/OBJ", "/datastream/TN");
  }

  return value;
};

export const getResourceImage = (
  resource: ResourceInput,
  size: string = "600,",
  region: string = "full",
) => {
  if (!resource) return "";
  if (Array.isArray(resource)) resource = resource[0];

  if (typeof resource === "string") {
    return normalizeUrl(normalizeDatastreamFallback(resource));
  }

  const resourceId = normalizeUrl(
    normalizeDatastreamFallback(resource.id || resource["@id"]),
  );

  if (!resource.service) return resourceId || "";

  const service = Array.isArray(resource.service)
    ? resource.service[0]
    : resource.service;

  const serviceId = normalizeUrl(service?.id || service?.["@id"]);

  if (!serviceId) return resourceId || "";

  return `${serviceId}/${region}/${size}/0/default.jpg`;
};
