import { buildCollection } from "@/services/iiif-builder";
import absoluteUrl from "next-absolute-url";
import { normalizeIiifUrl } from "@/services/iiif-url";
import { getCanopyManifests, getCanopyMetadata } from "@/services/canopy-data";

const ARTIST_MAP = {
  "paige-rftaart": "Braddock, Paige",
  "charlie-rftaart": "Daniel, Charles R. (Charlie), Jr., 1929-",
  "marshall-rftaart": "Ramsey, Marshall",
  "danny-rftaart": "Wilson, Danny",
};

const getArtistItems = (artistValue: string) => {
  const canopyMetadata = getCanopyMetadata();
  const canopyManifests = getCanopyManifests();
  const artistRows = canopyMetadata.filter(
    (row) => row.label === "Artist" && row.value === artistValue,
  );

  return artistRows
    .map((row) => {
      const manifest = canopyManifests.find(
        (item) =>
          normalizeIiifUrl(item.id) === normalizeIiifUrl(row.manifestId),
      );
      if (!manifest) return null;

      return {
        id: `/api/iiif/manifest/${manifest.slug}?viewer=1`,
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
  const slugValue = Array.isArray(slug) ? slug[0] : slug;
  const artistValue = ARTIST_MAP[slugValue as string];

  if (!artistValue) {
    return res
      .status(404)
      .json({ message: `Unknown collection slug: ${slugValue}` });
  }

  const items = getArtistItems(artistValue).map((item) => ({
    ...item,
    id: `${origin}${item.id}`,
    homepage: `${origin}${item.homepage}`,
  }));

  const data = {
    id: `${origin}/api/iiif/collection/${slugValue}`,
    label: artistValue,
    summary: `Works by ${artistValue}`,
    homepage: `${origin}/artists`,
    items,
  };

  return res.status(200).json(buildCollection(data));
}
