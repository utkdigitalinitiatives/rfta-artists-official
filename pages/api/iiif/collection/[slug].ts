import { buildCollection } from "@/services/iiif-builder";
import fs from "fs";
import path from "path";
import absoluteUrl from "next-absolute-url";
import { normalizeIiifUrl } from "@/services/iiif-url";

const loadCanopyJson = <T>(filename: string, fallback: T): T => {
  try {
    const filePath = path.join(process.cwd(), ".canopy", filename);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Failed to load .canopy/${filename}:`, error);
    return fallback;
  }
};

const CANOPY_MANIFESTS = loadCanopyJson<any[]>("manifests.json", []);
const CANOPY_METADATA = loadCanopyJson<any[]>("metadata.json", []);

const ARTIST_MAP = {
  "paige-rftaart": "Braddock, Paige",
  "charlie-rftaart": "Daniel, Charles R. (Charlie), Jr., 1929-",
  "marshall-rftaart": "Ramsey, Marshall",
  "danny-rftaart": "Wilson, Danny",
};

const getArtistItems = (artistValue: string) => {
  const artistRows = CANOPY_METADATA.filter(
    (row) => row.label === "Artist" && row.value === artistValue,
  );

  return artistRows
    .map((row) => {
      const manifest = CANOPY_MANIFESTS.find(
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
  const artistValue = ARTIST_MAP[slug as string];

  if (!artistValue) {
    return res
      .status(404)
      .json({ message: `Unknown collection slug: ${slug}` });
  }

  const items = getArtistItems(artistValue).map((item) => ({
    ...item,
    id: `${origin}${item.id}`,
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
