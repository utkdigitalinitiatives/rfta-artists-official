import React, { useEffect, useState } from "react";
import { getLabel } from "@/hooks/getLabel";
import { getJsonByURI } from "@/services/utils";
import Card from "@/components/Card/Card";
import { Item } from "@/components/Grid/Grid.styled";

const GridItem = ({ data }) => {
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    getJsonByURI(`/api/iiif/manifest/${data.slug}`).then((json) => {
      setItem(json);
    });
  }, []);

  let resource = null;

  if (!item) return <></>;

  if (item.thumbnail?.[0]) {
    resource = item.thumbnail[0];
  }

  /**
   * @todo: handle this better
   * 29 May 2024 -- Updated to check for undefined in the first array item
   */
  if (!resource && item.items[0] !== undefined) {
    resource = item.items[0].items[0].items[0].body;
  }
  if (!resource && item.sequences) {
    resource = item.sequences[0].canvases[0].images[0].resource;
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
