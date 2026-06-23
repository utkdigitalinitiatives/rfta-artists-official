const buildCollection = (data: any) => {
  const { id, label, summary, homepage, items } = data;

  const collectionItems = items.map(({ id, label, homepage, thumbnail, summary }: any) =>
    buildItem("Manifest", id, label, homepage, thumbnail, summary)
  );

  return {
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id,
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

const buildHomepage = (id: string, label: string) => ({
  id,
  type: "Text",
  label: { none: [label] },
  format: "text/html",
});

const buildThumbnail = (id: string) => ({
  id: id,
  type: "Image",
});

const buildItem = (type: string, id: string, label: string, homepage: string, thumbnail: string, summary: string) => ({
  id,
  type,
  label: {
    none: [label],
  },
  homepage: [buildHomepage(homepage, label)],
  thumbnail: [buildThumbnail(thumbnail)],
  summary: { none: [summary] },
});

export { buildCollection };
