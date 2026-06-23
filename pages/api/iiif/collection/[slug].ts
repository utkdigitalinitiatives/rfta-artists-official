import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { normalizeManifest } from "@/hooks/normalizeManifest";

const COLLECTION_MAP: Record<string, string> = {
    "paige-rftaart": "https://digital.lib.utk.edu/static/iiif/collections/paige_rftaart.json",
    "charlie-rftaart": "https://digital.lib.utk.edu/static/iiif/collections/charlie_rftaart.json",
    "marshall-rftaart": "https://digital.lib.utk.edu/static/iiif/collections/marshall_rftaart.json",
    "danny-rftaart": "https://digital.lib.utk.edu/static/iiif/collections/danny_rftaart.json",
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const rawSlug = req.query.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    if (!slug) {
        return res.status(400).json({ error: "Collection slug is required." });
    }

    const sourceUrl = COLLECTION_MAP[slug];

    if (!sourceUrl) {
        return res
            .status(404)
            .json({ error: `No collection mapping found for slug ${slug}.` });
    }

    try {
        const { data } = await axios.get(sourceUrl);
        const normalized = normalizeManifest(data);

        res.setHeader(
            "Cache-Control",
            "public, s-maxage=600, stale-while-revalidate=86400",
        );
        return res.status(200).json(normalized);
    } catch (error) {
        return res.status(502).json({ error: "Failed to load source collection." });
    }
}
