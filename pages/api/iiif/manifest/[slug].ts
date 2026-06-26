import { normalizeIiifPayload, normalizeIiifUrl } from "@/services/iiif-url";

const loadCanopyJson = <T>(filename: string, fallback: T): T => {
  try {
    if (filename === "manifests.json") {
      return require("../../../../.canopy/manifests.json") as T;
    }
  } catch (error) {
    console.error(`Failed to load .canopy/${filename}:`, error);
  }

  return fallback;
};

const CANOPY_MANIFESTS = loadCanopyJson<any[]>("manifests.json", []);

const ISLANDORA_DATASTREAM_RE =
  /\/collections\/islandora\/object\/([^/]+)\/datastream\/(OBJ|JPG|TN)\b/i;

const DATASTREAM_SEGMENT_RE = /\/datastream\/(OBJ|JPG|TN)\b/i;
const iiifDatastreamCache = new Map<string, string>();
const SERVICE_DATASTREAM_PREFERENCE = ["OBJ", "JP2", "JPG", "TN"];

const resolvePreferredServiceDatastream = async (resourceId: string) => {
  const match = resourceId.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return "JPG";

  const [, objectId] = match;
  const decodedObjectId = decodeURIComponent(objectId);
  const cacheKey = decodedObjectId.toLowerCase();
  if (iiifDatastreamCache.has(cacheKey)) {
    return iiifDatastreamCache.get(cacheKey) || "JPG";
  }

  for (const datastream of SERVICE_DATASTREAM_PREFERENCE) {
    const infoUrl = `https://digital.lib.utk.edu/iiif/2/collections~islandora~object~${decodedObjectId}~datastream~${datastream}/info.json`;

    try {
      const response = await fetch(infoUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        iiifDatastreamCache.set(cacheKey, datastream);
        return datastream;
      }
    } catch (error) {
      // Keep trying lower-priority datastreams when upstream errors.
    }
  }

  iiifDatastreamCache.set(cacheKey, "JPG");
  return "JPG";
};

const toImageServiceId = (resourceId: string, datastream: string) => {
  const match = resourceId.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return null;

  const [, objectId] = match;
  const decodedObjectId = decodeURIComponent(objectId);
  const imageDatastream = datastream.toUpperCase();

  return `https://digital.lib.utk.edu/iiif/2/collections~islandora~object~${decodedObjectId}~datastream~${imageDatastream}`;
};

const normalizeViewerResource = async (node: any): Promise<any> => {
  if (Array.isArray(node))
    return Promise.all(node.map((item) => normalizeViewerResource(item)));
  if (!node || typeof node !== "object") return node;

  const normalizedEntries = await Promise.all(
    Object.entries(node).map(async ([key, value]) => [
      key,
      await normalizeViewerResource(value),
    ]),
  );
  const normalized = Object.fromEntries(normalizedEntries) as Record<
    string,
    any
  >;

  if (normalized.type === "Image" && typeof normalized.id === "string") {
    const match = normalized.id.match(ISLANDORA_DATASTREAM_RE);
    const originalDatastream = match?.[2]?.toUpperCase();
    const resolvedServiceDatastream = await resolvePreferredServiceDatastream(
      normalized.id,
    );
    const serviceDatastream =
      resolvedServiceDatastream || originalDatastream || "JPG";
    const imageId = normalized.id.replace(
      DATASTREAM_SEGMENT_RE,
      "/datastream/JPG",
    );
    const serviceId = toImageServiceId(normalized.id, serviceDatastream);

    if (serviceId) {
      return {
        ...normalized,
        id: imageId,
        format: "image/jpeg",
        service: [
          {
            id: serviceId,
            "@id": serviceId,
            type: "ImageService2",
            profile: "level2",
          },
        ],
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
      const viewerManifest = await normalizeViewerResource(normalizedManifest);
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
