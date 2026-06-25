import { normalizeIiifUrl } from "@/services/iiif-url";

const forwardHeaders = (upstream) => {
    const contentType = upstream.headers.get("content-type");
    const cacheControl = upstream.headers.get("cache-control");
    const etag = upstream.headers.get("etag");
    const lastModified = upstream.headers.get("last-modified");

    const headers = {} as Record<string, string>;
    if (contentType) headers["Content-Type"] = contentType;
    if (cacheControl) headers["Cache-Control"] = cacheControl;
    if (etag) headers["ETag"] = etag;
    if (lastModified) headers["Last-Modified"] = lastModified;
    return headers;
};

const BROWSER_RENDERABLE = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

const isRenderableImage = (response) => {
    const contentType = (response.headers.get("content-type") || "").split(";")[0].trim();
    if (!response.ok) return false;
    return BROWSER_RENDERABLE.includes(contentType);
};

export default async function handler(req, res) {
    const primary = normalizeIiifUrl(req.query.primary as string);
    const fallback = normalizeIiifUrl(req.query.fallback as string);

    if (!primary || !fallback) {
        return res.status(400).json({ message: "Missing primary or fallback URL" });
    }

    try {
        // Use HEAD to check content-type before committing to download
        const primaryHead = await fetch(primary, { method: "HEAD" });
        if (isRenderableImage(primaryHead)) {
            const primaryResponse = await fetch(primary);
            const buffer = Buffer.from(await primaryResponse.arrayBuffer());
            res.setHeader("Vary", "Accept");
            res.setHeader("X-IIIF-Image-Source", "primary");
            Object.entries(forwardHeaders(primaryResponse)).forEach(([key, value]) => {
                res.setHeader(key, value);
            });
            return res.status(200).send(buffer);
        }

        const fallbackResponse = await fetch(fallback);
        if (!isRenderableImage(fallbackResponse)) {
            return res.status(502).json({
                message: "Neither primary nor fallback returned a renderable image",
            });
        }

        const buffer = Buffer.from(await fallbackResponse.arrayBuffer());
        res.setHeader("Vary", "Accept");
        res.setHeader("X-IIIF-Image-Source", "fallback");
        Object.entries(forwardHeaders(fallbackResponse)).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        return res.status(200).send(buffer);
    } catch (error) {
        return res.status(500).json({ message: `Image proxy failed: ${error.message}` });
    }
}
