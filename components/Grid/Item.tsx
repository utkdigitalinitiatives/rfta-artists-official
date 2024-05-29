import React, { useEffect, useState } from "react";
import { getLabel } from "@/hooks/getLabel";
import { getJsonByURI } from "@/services/utils";
import Card from "@/components/Card/Card";
import { Item } from "@/components/Grid/Grid.styled";

const GridItem = ({ data }) => {
  const [item, setItem] = useState();

  useEffect(() => {
    let isMounted = true;
    getJsonByURI(data.id).then((json) => {
      setItem(json);
    });
  }, []);

  let resource = null;

  if (!item) return <></>;

  /**
   * @todo: handle this better
   * 29 May 2024 -- Updated to check for undefined in the first array item
   */
  if (item.items[0] !== undefined) { 
    resource = item.items[0].items[0].items[0].body
  };
  if (item.sequences) {
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
