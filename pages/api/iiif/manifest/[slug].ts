import CANOPY_MANIFESTS from "@/.canopy/manifests.json";
import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";
import absoluteUrl from "next-absolute-url";

const normalizeManifestImages = (manifest: any, origin: string) => {
    if (!manifest?.items) return manifest;

    manifest.items.forEach((canvas: any) => {
        canvas?.items?.forEach((annotationPage: any) => {
            annotationPage?.items?.forEach((annotation: any) => {
                const body = annotation?.body;
                if (!body || body.service || typeof body.id !== "string") return;

                // Route through a local proxy that attempts OBJ first and falls back to TN.
                if (body.id.includes("/datastream/OBJ")) {
                    const primary = normalizeIiifUrl(body.id);
                    const fallback = normalizeIiifUrl(
                        body.id.replace("/datastream/OBJ", "/datastream/TN")
                    );
                    body.id = `${origin}/api/iiif/image?primary=${encodeURIComponent(
                        primary
                    )}&fallback=${encodeURIComponent(fallback)}`;
                    body.format = "image/jpeg";
                }
            });
        });
    });

    return manifest;
};

export default async function handler(req, res) {
    const { origin } = absoluteUrl(req);
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
        const normalized = normalizeManifestImages(
            normalizeIiifPayload(manifest),
            origin
        );
        return res.status(200).json(normalized);
    } catch (error) {
        return res.status(500).json({ message: `Manifest fetch failed: ${error.message}` });
    }
}
