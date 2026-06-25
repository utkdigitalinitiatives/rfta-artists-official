import CANOPY_MANIFESTS from "@/.canopy/manifests.json";
import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";

const normalizeManifestImages = (manifest: any) => {
    if (!manifest?.items) return manifest;

    manifest.items.forEach((canvas: any) => {
        canvas?.items?.forEach((annotationPage: any) => {
            annotationPage?.items?.forEach((annotation: any) => {
                const body = annotation?.body;
                if (!body || body.service || typeof body.id !== "string") return;

                // Some source manifests provide only OBJ datastreams (often non-renderable/download-only).
                // Fallback to TN so Clover can always render an image.
                if (body.id.includes("/datastream/OBJ")) {
                    body.id = body.id.replace("/datastream/OBJ", "/datastream/TN");
                    body.format = "image/jpeg";
                }
            });
        });
    });

    return manifest;
};

export default async function handler(req, res) {
    const { slug } = req.query;
    const manifestRef = CANOPY_MANIFESTS.find((item) => item.slug === slug);

    if (!manifestRef) {
        return res.status(404).json({ message: `Manifest not found for slug: ${slug}` });
    }

    try {
        const response = await fetch(normalizeIiifUrl(manifestRef.id));
        if (!response.ok) {
            return res.status(response.status).json({ message: "Failed to load manifest" });
        }

        const manifest = await response.json();
        const normalized = normalizeManifestImages(normalizeIiifPayload(manifest));
        return res.status(200).json(normalized);
    } catch (error) {
        return res.status(500).json({ message: `Manifest fetch failed: ${error.message}` });
    }
}
