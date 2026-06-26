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
const MANIFEST_CACHE_CONTROL =
  "public, s-maxage=3600, stale-while-revalidate=86400, max-age=600";
const FETCH_TIMEOUT_MS = 1800;
const DATASTREAM_PROBE_TIMEOUT_MS = 4500;

const ISLANDORA_DATASTREAM_RE =
  /\/collections\/islandora\/object\/([^/]+)\/datastream\/(OBJ|JPG|TN)\b/i;

const DATASTREAM_SEGMENT_RE = /\/datastream\/(OBJ|JPG|TN)\b/i;
type DatastreamProbeResult = {
  datastream: string;
  width?: number;
  height?: number;
};

const iiifDatastreamCache = new Map<string, DatastreamProbeResult>();
const normalizedManifestCache = new Map<string, Promise<any>>();
const viewerManifestCache = new Map<string, Promise<any>>();
const SERVICE_DATASTREAM_PREFERENCE = ["JP2", "OBJ", "JPG", "TN"];

const fetchWithTimeout = async (
  url: string,
  init?: RequestInit,
  timeoutMs = FETCH_TIMEOUT_MS,
) => {
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    return await fetch(url, {
      ...init,
      ...(controller ? { signal: controller.signal } : {}),
    });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const getNormalizedManifest = (manifestId: string) => {
  const cacheKey = normalizeIiifUrl(manifestId);

  if (!normalizedManifestCache.has(cacheKey)) {
    normalizedManifestCache.set(
      cacheKey,
      (async () => {
        const response = await fetchWithTimeout(cacheKey);
        if (!response.ok) {
          throw new Error(`Failed to load manifest (${response.status})`);
        }

        const manifest = await response.json();
        return normalizeIiifPayload(manifest);
      })(),
    );
  }

  return normalizedManifestCache.get(cacheKey)!;
};

const probeDatastreamAvailability = async (
  decodedObjectId: string,
  datastream: string,
) => {
  const infoUrl = `https://digital.lib.utk.edu/iiif/2/collections~islandora~object~${decodedObjectId}~datastream~${datastream}/info.json`;

  try {
    const response = await fetchWithTimeout(
      infoUrl,
      {
        headers: {
          Accept: "application/json",
        },
      },
      DATASTREAM_PROBE_TIMEOUT_MS,
    );

    if (!response.ok) return null;

    let width: number | undefined;
    let height: number | undefined;

    try {
      const info = await response.json();
      if (typeof info?.width === "number") width = info.width;
      if (typeof info?.height === "number") height = info.height;
    } catch (error) {
      // Keep datastream eligibility even when metadata parsing fails.
    }

    return { datastream, width, height };
  } catch (error) {
    return null;
  }
};

const resolvePreferredServiceDatastream = async (resourceId: string) => {
  const match = resourceId.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return { datastream: "JPG" };

  const [, objectId] = match;
  const decodedObjectId = decodeURIComponent(objectId);
  const cacheKey = decodedObjectId.toLowerCase();
  if (iiifDatastreamCache.has(cacheKey)) {
    return iiifDatastreamCache.get(cacheKey) || { datastream: "JPG" };
  }

  const availabilityChecks = await Promise.all(
    SERVICE_DATASTREAM_PREFERENCE.map((datastream) =>
      probeDatastreamAvailability(decodedObjectId, datastream),
    ),
  );

  const available = availabilityChecks.filter(
    Boolean,
  ) as DatastreamProbeResult[];

  const resolvedProbe = SERVICE_DATASTREAM_PREFERENCE.map(
    (preferredDatastream) =>
      available.find((result) => result.datastream === preferredDatastream),
  ).find(Boolean) || {
    datastream: "JPG",
  };

  iiifDatastreamCache.set(cacheKey, resolvedProbe);
  return resolvedProbe;
};

const getViewerManifest = (manifestId: string) => {
  const cacheKey = normalizeIiifUrl(manifestId);

  if (!viewerManifestCache.has(cacheKey)) {
    viewerManifestCache.set(
      cacheKey,
      getNormalizedManifest(manifestId).then((manifest) =>
        normalizeViewerResource(manifest),
      ),
    );
  }

  return viewerManifestCache.get(cacheKey)!;
};

const toImageServiceId = (resourceId: string, datastream: string) => {
  const match = resourceId.match(ISLANDORA_DATASTREAM_RE);
  if (!match) return null;

  const [, objectId] = match;
  const decodedObjectId = decodeURIComponent(objectId);
  const imageDatastream = datastream.toUpperCase();

  return `https://digital.lib.utk.edu/iiif/2/collections~islandora~object~${decodedObjectId}~datastream~${imageDatastream}`;
};

const getCanvasPaintingDimensions = (canvas: any) => {
  if (!Array.isArray(canvas?.items)) return null;

  for (const page of canvas.items) {
    if (page?.type !== "AnnotationPage" || !Array.isArray(page?.items))
      continue;

    for (const annotation of page.items) {
      const motivation = annotation?.motivation;
      const isPainting = Array.isArray(motivation)
        ? motivation.includes("painting")
        : motivation === "painting";

      if (!isPainting) continue;

      const body = Array.isArray(annotation?.body)
        ? annotation.body[0]
        : annotation?.body;

      if (
        body &&
        typeof body.width === "number" &&
        typeof body.height === "number"
      ) {
        return {
          width: body.width,
          height: body.height,
        };
      }
    }
  }

  return null;
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

  if (normalized.type === "Canvas") {
    const paintingDimensions = getCanvasPaintingDimensions(normalized);

    if (paintingDimensions) {
      return {
        ...normalized,
        width: paintingDimensions.width,
        height: paintingDimensions.height,
      };
    }
  }

  if (normalized.type === "Image" && typeof normalized.id === "string") {
    if (normalized.service) {
      return normalized;
    }

    const match = normalized.id.match(ISLANDORA_DATASTREAM_RE);
    const originalDatastream = match?.[2]?.toUpperCase();
    const resolvedService = await resolvePreferredServiceDatastream(
      normalized.id,
    );
    const serviceDatastream =
      resolvedService.datastream || originalDatastream || "JPG";
    const serviceId = toImageServiceId(normalized.id, serviceDatastream);

    if (serviceId) {
      return {
        ...normalized,
        id: `${serviceId}/full/full/0/default.jpg`,
        format: "image/jpeg",
        width:
          typeof resolvedService.width === "number"
            ? resolvedService.width
            : normalized.width,
        height:
          typeof resolvedService.height === "number"
            ? resolvedService.height
            : normalized.height,
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
  const manifestRef = CANOPY_MANIFESTS.find((item) => item.slug === slugValue);

  if (!manifestRef) {
    return res
      .status(404)
      .json({ message: `Manifest not found for slug: ${slug}` });
  }

  try {
    res.setHeader("Cache-Control", MANIFEST_CACHE_CONTROL);

    if (viewer) {
      const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
      const host =
        (req.headers["x-forwarded-host"] as string) || req.headers.host;
      const localManifestId = host
        ? `${protocol}://${host}/api/iiif/manifest/${slugValue}?viewer=1`
        : `/api/iiif/manifest/${slugValue}?viewer=1`;
      const viewerManifest = await getViewerManifest(manifestRef.id);

      return res.status(200).json({
        ...viewerManifest,
        id: localManifestId,
      });
    }

    const normalizedManifest = await getNormalizedManifest(manifestRef.id);
    return res.status(200).json(normalizedManifest);
  } catch (error) {
    normalizedManifestCache.delete(normalizeIiifUrl(manifestRef.id));
    viewerManifestCache.delete(normalizeIiifUrl(manifestRef.id));

    return res
      .status(500)
      .json({ message: `Manifest fetch failed: ${error.message}` });
  }
}
