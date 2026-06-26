const DIGITAL_LIB_HTTP_RE = /http:\/\/digital\.lib\.utk\.edu/gi;
const DATASTREAM_OBJ_RE = /\/datastream\/OBJ\b/g;
const ISLANDORA_DATASTREAM_RE =
  /\/collections\/islandora\/object\/([^/]+)\/datastream\/(OBJ|JPG|TN)\b/i;

export const normalizeIiifUrl = (value?: string | null) => {
  if (!value) return value;
  return value
    .replace(DIGITAL_LIB_HTTP_RE, "https://digital.lib.utk.edu")
    .replace(DATASTREAM_OBJ_RE, "/datastream/JPG");
};

export const normalizeIiifPayload = <T>(payload: T): T => {
  if (typeof payload === "string") {
    return normalizeIiifUrl(payload) as T;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeIiifPayload(item)) as T;
  }

  if (payload && typeof payload === "object") {
    const entries = Object.entries(payload as Record<string, unknown>).map(
      ([key, value]) => [key, normalizeIiifPayload(value)],
    );
    return Object.fromEntries(entries) as T;
  }

  return payload;
};

export const toIiifImageApiUrl = (
  value?: string | null,
  region = "full",
  size = "600,",
) => {
  const normalized = normalizeIiifUrl(value);
  if (!normalized) return normalized;

  const match = normalized.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return normalized;

  const [, objectIdRaw, datastreamRaw] = match;
  const objectId = decodeURIComponent(objectIdRaw);
  const datastream =
    datastreamRaw.toUpperCase() === "OBJ" ? "JPG" : datastreamRaw.toUpperCase();

  return `https://digital.lib.utk.edu/iiif/2/collections~islandora~object~${objectId}~datastream~${datastream}/${region}/${size}/0/default.jpg`;
};
