import { buildCollection } from "@/services/iiif-builder";
import CANOPY_MANIFESTS from "@/.canopy/manifests.json";
import CANOPY_METADATA from "@/.canopy/metadata.json";
import absoluteUrl from "next-absolute-url";
import { normalizeIiifUrl } from "@/services/iiif-url";

const ARTIST_MAP = {
    "paige-rftaart": "Braddock, Paige",
    "charlie-rftaart": "Daniel, Charles R. (Charlie), Jr., 1929-",
    "marshall-rftaart": "Ramsey, Marshall",
    "danny-rftaart": "Wilson, Danny",
};

const getArtistItems = (artistValue: string) => {
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
                id: normalizeIiifUrl(manifest.id),
                label: manifest.label[0],
                summary: `Artwork by ${artistValue}`,
                homepage: `/works/${manifest.slug}`,
                thumbnail: normalizeIiifUrl(row.thumbnail),
            };
        })
        .filter(Boolean);
};

export default function handler(req, res) {
    const { origin } = absoluteUrl(req);
    const { slug } = req.query;
    const artistValue = ARTIST_MAP[slug as string];

    if (!artistValue) {
        return res.status(404).json({ message: `Unknown collection slug: ${slug}` });
    }

    const items = getArtistItems(artistValue).map((item) => ({
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
