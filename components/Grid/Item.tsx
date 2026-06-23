import React, { useEffect, useState } from "react";
import { getLabel } from "@/hooks/getLabel";
import { getJsonByURI } from "@/services/utils";
import Card from "@/components/Card/Card";
import { Item } from "@/components/Grid/Grid.styled";

type GridItemData = {
  id: string;
  slug: string;
  thumbnail?: string;
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
    if (data.thumbnail) return;

    let isMounted = true;
    getJsonByURI(`/api/iiif/manifest/${data.slug}`).then((json: ManifestLike) => {
      if (isMounted) setItem(json);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  let resource: IIIFResource | null = null;

  if (!data.thumbnail && !item) return <></>;

  if (data.thumbnail) {
    resource = { id: data.thumbnail };
  }

  // Prefer manifest thumbnail for card contexts so we do not load full OBJ payloads.
  const thumbnail = item
    ? (Array.isArray(item.thumbnail)
      ? item.thumbnail[0]
      : item.thumbnail)
    : undefined;

  if (!resource && thumbnail) {
    resource = thumbnail;
  } else if (!resource && item) {
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
        label={getLabel(item?.label || "Untitled")}
        path={`/works/${data.slug}`}
        resource={resource}
      />
    </Item>
  );
};

export default GridItem;
