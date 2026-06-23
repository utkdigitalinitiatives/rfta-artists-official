import { normalizeIiifUrl } from "@/hooks/normalizeIiifUrl";

/**
 * Recursively normalize all HTTP URLs in a manifest/collection to HTTPS
 * @param obj - The manifest or collection object to normalize
 * @returns A new object with all URLs normalized
 */
export const normalizeManifest = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return normalizeIiifUrl(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => normalizeManifest(item));
  }

  if (typeof obj === 'object') {
    const normalized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        normalized[key] = normalizeManifest(obj[key]);
      }
    }
    return normalized;
  }

  return obj;
};
