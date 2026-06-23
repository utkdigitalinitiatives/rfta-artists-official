/**
 * Normalize IIIF URLs from HTTP to HTTPS
 * @param url - The URL to normalize
 * @returns The normalized HTTPS URL
 */
export const normalizeIiifUrl = (url: string): string => {
  if (typeof url !== 'string') {
    return url;
  }

  // Convert http to https for digital.lib.utk.edu
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  return url;
};
