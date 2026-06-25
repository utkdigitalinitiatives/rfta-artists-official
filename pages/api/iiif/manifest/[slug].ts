import CANOPY_MANIFESTS from "../../../../.canopy/manifests.json";
import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";

const ISLANDORA_DATASTREAM_RE =
  /\/collections\/islandora\/object\/([^/]+)\/datastream\/(OBJ|JPG|TN)\b/i;

const mapDatastreamToImageApi = () => "JPG";

const toImageServiceId = (resourceId: string) => {
  const match = resourceId.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return null;

  const [, objectId] = match;
  const imageDatastream = mapDatastreamToImageApi();

  return `https://digital.lib.utk.edu/iiif/2/collections~islandora~object~${objectId}~datastream~${imageDatastream}`;
};

const normalizeViewerResource = (node: any): any => {
  if (Array.isArray(node))
    return node.map((item) => normalizeViewerResource(item));
  if (!node || typeof node !== "object") return node;

  const normalizedEntries = Object.entries(node).map(([key, value]) => [
    key,
    normalizeViewerResource(value),
  ]);
  const normalized = Object.fromEntries(normalizedEntries) as Record<
    string,
    any
  >;

  if (normalized.type === "Image" && typeof normalized.id === "string") {
    const imageId = normalized.id.replace(
      /\/datastream\/(OBJ|JPG|TN)\b/i,
      "/datastream/JPG",
    );

    if (toImageServiceId(normalized.id)) {
      // Force Clover simple-image mode for browser compatibility.
      // Tiled mode is currently causing blank canvases in Firefox/Chrome.
      return {
        ...normalized,
        id: imageId,
        format: "image/jpeg",
        service: undefined,
      };
    }
  }

  return normalized;
};

export default async function handler(req, res) {
  const { slug, viewer } = req.query;
  const slugValue = Array.isArray(slug) ? slug[0] : slug;
  const manifestRef = CANOPY_MANIFESTS.find((item) => item.slug === slug);

  if (!manifestRef) {
    return res
      .status(404)
      .json({ message: `Manifest not found for slug: ${slug}` });
  }

  try {
    const response = await fetch(normalizeIiifUrl(manifestRef.id));
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Failed to load manifest" });
    }

    const manifest = await response.json();
    const normalizedManifest = normalizeIiifPayload(manifest);

    if (viewer) {
      const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
      const host = req.headers.host;
      const localManifestId = `${protocol}://${host}/api/iiif/manifest/${slugValue}?viewer=1`;
      const viewerManifest = normalizeViewerResource(normalizedManifest);
      viewerManifest.id = localManifestId;

      return res.status(200).json(viewerManifest);
    }

    return res.status(200).json(normalizedManifest);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Manifest fetch failed: ${error.message}` });
  }
}
