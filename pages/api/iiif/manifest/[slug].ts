import CANOPY_MANIFESTS from "../../../../.canopy/manifests.json";
import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";

const ISLANDORA_DATASTREAM_RE =
  /\/collections\/islandora\/object\/([^/]+)\/datastream\/(OBJ|JPG|TN)\b/i;

const mapDatastreamToImageApi = (datastream: string) => {
  if (datastream.toUpperCase() === "OBJ") return "JPG";
  return datastream.toUpperCase();
};

const toImageServiceId = (resourceId: string) => {
  const match = resourceId.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return null;

  const [, objectId, datastream] = match;
  const imageDatastream = mapDatastreamToImageApi(datastream);

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
    const serviceId = toImageServiceId(normalized.id);
    if (serviceId) {
      return {
        ...normalized,
        id: `${serviceId}/full/max/0/default.jpg`,
        format: "image/jpeg",
        service: [
          {
            id: serviceId,
            type: "ImageService2",
            profile: "http://iiif.io/api/image/2/level2.json",
          },
        ],
      };
    }
  }

  return normalized;
};

export default async function handler(req, res) {
  const { slug, viewer } = req.query;
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
      return res.status(200).json(normalizeViewerResource(normalizedManifest));
    }

    return res.status(200).json(normalizedManifest);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Manifest fetch failed: ${error.message}` });
  }
}
