const DIGITAL_LIB_HTTP_RE = /http:\/\/digital\.lib\.utk\.edu/gi;
const DATASTREAM_OBJ_RE = /\/datastream\/OBJ\b/g;

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
