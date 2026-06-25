import CANOPY_MANIFESTS from "@/.canopy/manifests.json";
import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";

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
        return res.status(200).json(normalizeIiifPayload(manifest));
    } catch (error) {
        return res.status(500).json({ message: `Manifest fetch failed: ${error.message}` });
    }
}
