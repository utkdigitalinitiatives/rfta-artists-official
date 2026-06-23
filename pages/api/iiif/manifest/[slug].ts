import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import CANOPY_MANIFESTS from "@/.canopy/manifests.json";

type CanopyManifest = {
  id: string;
  slug: string;
};

type ResourceLike = {
  id?: string;
  "@id"?: string;
  service?: unknown;
};

const toIiifServiceId = (resourceId?: string) => {
  if (!resourceId) return null;

  try {
    const httpsId = resourceId.replace(/^http:\/\//i, "https://");
    const parsed = new URL(httpsId);

    if (!parsed.pathname.includes("/collections/islandora/object/")) {
      return null;
    }

    const token = parsed.pathname.replace(/^\/+/, "").replace(/\//g, "~");
    return `https://${parsed.host}/iiif/2/${token}`;
  } catch (error) {
    return null;
  }
};

const patchResource = (resource: ResourceLike | undefined) => {
  if (!resource || resource.service) return;

  const resourceId = resource.id || resource["@id"];
  const iiifServiceId = toIiifServiceId(resourceId);

  if (!iiifServiceId) return;

  resource.service = [
    {
      id: iiifServiceId,
      type: "ImageService2",
      profile: "http://iiif.io/api/image/2/level2.json",
    },
  ];
};

const patchManifest = (manifest: any) => {
  const canvasesV3 = manifest?.items || [];
  canvasesV3.forEach((canvas: any) => {
    (canvas?.items || []).forEach((page: any) => {
      (page?.items || []).forEach((annotation: any) => {
        const body = annotation?.body;
        if (Array.isArray(body)) {
          body.forEach((resource) => patchResource(resource));
          return;
        }
        patchResource(body);
      });
    });
  });

  const canvasesV2 = manifest?.sequences?.[0]?.canvases || [];
  canvasesV2.forEach((canvas: any) => {
    (canvas?.images || []).forEach((image: any) => {
      patchResource(image?.resource);
    });
  });

  return manifest;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const rawSlug = req.query.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) {
    return res.status(400).json({ error: "Manifest slug is required." });
  }

  const index = (CANOPY_MANIFESTS as CanopyManifest[]).find(
    (item) => item.slug === slug,
  );

  if (!index) {
    return res
      .status(404)
      .json({ error: `No manifest found for slug ${slug}.` });
  }

  try {
    const { data } = await axios.get(index.id);
    const patchedManifest = patchManifest(JSON.parse(JSON.stringify(data)));

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=86400",
    );
    return res.status(200).json(patchedManifest);
  } catch (error) {
    return res.status(502).json({ error: "Failed to load source manifest." });
  }
}
