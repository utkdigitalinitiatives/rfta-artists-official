const normalizeIiifUrl = (value: any) => {
  if (!value || typeof value !== "string") return value;
  return value.replace(/http:\/\/digital\.lib\.utk\.edu/gi, "https://digital.lib.utk.edu");
};

const buildCollection = (data: any) => {
  const { id, label, summary, homepage, items } = data;

  const collectionItems = items.map(({ id, label, homepage, thumbnail, summary }: any) =>
    buildItem("Manifest", id, label, homepage, thumbnail, summary)
  );

  return {
    "@context": "https://iiif.io/api/presentation/3/context.json",
    id: normalizeIiifUrl(id),
    type: "Collection",
    label: {
      none: [label],
    },
    summary: {
      none: [summary],
    },
    homepage: [buildHomepage(homepage, label)],
    items: collectionItems,
  };
};

const buildHomepage = (id: any, label: any) => ({
  id: normalizeIiifUrl(id),
  type: "Text",
  label: { none: [label] },
  format: "text/html",
});

const buildThumbnail = (id: any) => ({
  id: normalizeIiifUrl(id),
  type: "Image",
});

const buildItem = (type: any, id: any, label: any, homepage: any, thumbnail: any, summary: any) => ({
  id: normalizeIiifUrl(id),
  type,
  label: {
    none: [label],
  },
  homepage: [buildHomepage(homepage, label)],
  thumbnail: [buildThumbnail(thumbnail)],
  summary: { none: [summary] },
});

export { buildCollection };
