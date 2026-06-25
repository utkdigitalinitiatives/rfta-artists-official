import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";

export const getJsonByURI = async (uri) => {
  const response = await fetch(normalizeIiifUrl(uri));
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return normalizeIiifPayload(data);
}
