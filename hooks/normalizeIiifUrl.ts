export const normalizeIiifUrl = (url?: string) => {
    if (!url || typeof url !== "string") return url;

    // Force HTTPS for digital.lib.utk resources to avoid mixed-content requests.
    return url.replace(/^http:\/\/(digital\.lib\.utk(?:\.edu)?)(?=\/|$)/i, "https://$1");
};
