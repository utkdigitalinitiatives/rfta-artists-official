import React, { useEffect, useState } from "react";
import { getLabel } from "@/hooks/getLabel";
import { getJsonByURI } from "@/services/utils";
import Card from "@/components/Card/Card";
import { Item } from "@/components/Grid/Grid.styled";

type GridItemData = {
  id: string;
  slug: string;
};

type IIIFResource = {
  id?: string;
  "@id"?: string;
  service?: unknown;
};

type LabelLike = string | Record<string, string[]>;

type ManifestLike = {
  label: LabelLike;
  thumbnail?: IIIFResource | IIIFResource[];
  items?: Array<{
    items?: Array<{
      items?: Array<{
        body?: IIIFResource;
      }>;
    }>;
  }>;
  sequences?: Array<{
    canvases?: Array<{
      images?: Array<{
        resource?: IIIFResource;
      }>;
    }>;
  }>;
};

const GridItem = ({ data }: { data: GridItemData }) => {
  const [item, setItem] = useState<ManifestLike | null>(null);

  useEffect(() => {
    let isMounted = true;
    const manifestUrl = `/api/iiif/manifest/${data.slug}`;

    getJsonByURI(manifestUrl)
      .then((json: ManifestLike) => {
        if (isMounted) setItem(json);
      })
      .catch(() => {
        if (isMounted) setItem(null);
      });

    return () => {
      isMounted = false;
    };
  }, [data.slug]);

  let resource: IIIFResource | null = null;

  if (!item) return <></>;

  // Prefer manifest thumbnail for card contexts so we do not load full OBJ payloads.
  const thumbnail = Array.isArray(item.thumbnail)
    ? item.thumbnail[0]
    : item.thumbnail;

  if (thumbnail) {
    resource = thumbnail;
  } else {
    /**
     * @todo: handle this better
     * 29 May 2024 -- Updated to check for undefined in the first array item
     */
    if (item.items && item.items[0] !== undefined) {
      resource = item.items[0].items?.[0]?.items?.[0]?.body || null;
    }

    if (item.sequences) {
      resource = item.sequences[0].canvases?.[0]?.images?.[0]?.resource || null;
    }
  }

  return (
    <Item className="can-grid-column">
      <Card
        key={data.id}
        label={getLabel(item.label)}
        path={`/works/${data.slug}`}
        resource={resource}
      />
    </Item>
  );
};

export default GridItem;
