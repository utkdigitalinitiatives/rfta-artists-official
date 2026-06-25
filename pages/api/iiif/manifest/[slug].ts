import CANOPY_MANIFESTS from "@/.canopy/manifests.json";
import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";

const normalizeManifestImages = (manifest: any) => {
    if (!manifest?.items) return manifest;

    manifest.items.forEach((canvas: any) => {
        canvas?.items?.forEach((annotationPage: any) => {
            annotationPage?.items?.forEach((annotation: any) => {
                const body = annotation?.body;
                if (!body) return;

                const normalizeBody = (imageBody: any) => {
                    if (!imageBody || typeof imageBody.id !== "string") return;

                    const normalized = normalizeIiifUrl(imageBody.id);

                    // Rewrite OBJ datastreams to TN for guaranteed browser compatibility
                    if (normalized.includes("/datastream/OBJ")) {
                        imageBody.id = normalizeIiifUrl(
                            normalized.replace("/datastream/OBJ", "/datastream/TN")
                        );
                        imageBody.format = "image/jpeg";
                    } else {
                        imageBody.id = normalized;
                    }
                };

                if (Array.isArray(body)) {
                    body.forEach(normalizeBody);
                    return;
                }

                normalizeBody(body);
            });
        });
    });

    return manifest;
};

export default async function handler(req: any, res: any) {
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
    } catch (error: any) {
        return res.status(500).json({ message: `Manifest fetch failed: ${error.message}` });
    }
}
