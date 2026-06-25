import { buildCollection } from "@/services/iiif-builder";
import CANOPY_MANIFESTS from "@/.canopy/manifests.json";
import CANOPY_METADATA from "@/.canopy/metadata.json";
import { normalizeIiifUrl } from "@/services/iiif-url";

const ARTIST_MAP = {
    "paige-rftaart": "Braddock, Paige",
    "charlie-rftaart": "Daniel, Charles R. (Charlie), Jr., 1929-",
    "marshall-rftaart": "Ramsey, Marshall",
    "danny-rftaart": "Wilson, Danny",
};

const getRequestOrigin = (req) => {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const forwardedHost = req.headers["x-forwarded-host"];
    const host = forwardedHost || req.headers.host;
    const proto = Array.isArray(forwardedProto)
        ? forwardedProto[0]
        : (forwardedProto || "").split(",")[0].trim();

    const safeProto = proto || (/localhost|127\.0\.0\.1/.test(host) ? "http" : "https");
    return `${safeProto}://${host}`;
};

const getArtistItems = (artistValue: string, origin: string) => {
    const artistRows = CANOPY_METADATA.filter(
        (row) => row.label === "Artist" && row.value === artistValue
    );

    return artistRows
        .map((row) => {
            const manifest = CANOPY_MANIFESTS.find(
                (item) => normalizeIiifUrl(item.id) === normalizeIiifUrl(row.manifestId)
            );
            if (!manifest) return null;

            return {
                id: `${origin}/api/iiif/manifest/${manifest.slug}`,
                label: manifest.label[0],
                summary: `Artwork by ${artistValue}`,
                homepage: `/works/${manifest.slug}`,
                thumbnail: normalizeIiifUrl(row.thumbnail),
            };
        })
        .filter(Boolean);
};

export default function handler(req, res) {
    const origin = getRequestOrigin(req);
    const { slug } = req.query;
    const artistValue = ARTIST_MAP[slug as string];

    if (!artistValue) {
        return res.status(404).json({ message: `Unknown collection slug: ${slug}` });
    }

    const items = getArtistItems(artistValue, origin).map((item) => ({
        ...item,
        homepage: `${origin}${item.homepage}`,
    }));

    const data = {
        id: `${origin}/api/iiif/collection/${slug}`,
        label: artistValue,
        summary: `Works by ${artistValue}`,
        homepage: `${origin}/artists`,
        items,
    };

    return res.status(200).json(buildCollection(data));
}
