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
        const { data } = await axios.get(sourceUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9",
            },
            timeout: 10000,
        });

        // Detect if we got HTML instead of JSON (Anubis bot detection)
        if (typeof data === "string" && data.includes("<!doctype")) {
            console.error(`[iiif/collection/${slug}] Received HTML bot-detection page instead of JSON from ${sourceUrl}`);
            return res.status(502).json({ error: "Upstream service returned bot-detection page. Please retry." });
        }

        const normalized = normalizeManifest(data);

        res.setHeader(
            "Cache-Control",
            "public, s-maxage=600, stale-while-revalidate=86400",
        );
        return res.status(200).json(normalized);
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`[iiif/collection/${slug}] Error: ${errorMsg}`);
        return res.status(502).json({ error: "Failed to load source collection." });
    }
}
