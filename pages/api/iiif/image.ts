import { normalizeIiifUrl } from "@/services/iiif-url";

const forwardHeaders = (upstream: any) => {
    const contentType = upstream.headers.get("content-type");
    const cacheControl = upstream.headers.get("cache-control");
    const etag = upstream.headers.get("etag");
    const lastModified = upstream.headers.get("last-modified");

    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (cacheControl) headers["Cache-Control"] = cacheControl;
    if (etag) headers["ETag"] = etag;
    if (lastModified) headers["Last-Modified"] = lastModified;
    return headers;
};

const BROWSER_RENDERABLE = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

const isRenderableImage = (response: any) => {
    const contentType = (response.headers.get("content-type") || "").split(";")[0].trim();
    if (!response.ok) return false;
    return BROWSER_RENDERABLE.includes(contentType);
};

export default async function handler(req: any, res: any) {
    const primary = normalizeIiifUrl(req.query.primary as string);
    const fallback = normalizeIiifUrl(req.query.fallback as string);

    if (!primary || !fallback) {
        return res.status(400).json({ message: "Missing primary or fallback URL" });
    }

    const TIMEOUT_MS = 10000;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        // Try primary with timeout
        try {
            const primaryResponse = await fetch(primary, { signal: controller.signal });
            clearTimeout(timeout);
            
            if (isRenderableImage(primaryResponse)) {
                const buffer = Buffer.from(await primaryResponse.arrayBuffer());
                res.setHeader("Vary", "Accept");
                res.setHeader("X-IIIF-Image-Source", "primary");
                Object.entries(forwardHeaders(primaryResponse)).forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
                return res.status(200).send(buffer);
            }
        } catch (e: any) {
            // Primary failed or timed out; continue to fallback
            if (e.name !== "AbortError") {
                console.warn(`Primary fetch failed: ${e.message}`);
            }
        }

        // Reset timeout for fallback
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), TIMEOUT_MS);

        try {
            const fallbackResponse = await fetch(fallback, { signal: fallbackController.signal });
            clearTimeout(fallbackTimeout);
            
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
        } catch (e: any) {
            clearTimeout(fallbackTimeout);
            return res.status(502).json({
                message: `Fallback fetch failed: ${e.message}`,
            });
        }
    } catch (error: any) {
        clearTimeout(timeout);
        return res.status(500).json({ message: `Image proxy failed: ${error.message}` });
    }
}
