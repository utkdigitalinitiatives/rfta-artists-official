import BloomIIIF from "@samvera/bloom-iiif";
import { useEffect, useState } from "react";
import { Label } from "@samvera/nectar-iiif";

const Related = ({ label, artist }) => {
  const [baseUrl, setBaseUrl] = useState("");
  const bloom_values = {
    "Braddock, Paige": "https://digital.lib.utk.edu/static/iiif/collections/paige_rftaart.json",
    "Daniel, Charles R. (Charlie), Jr., 1929-": "https://digital.lib.utk.edu/static/iiif/collections/charlie_rftaart.json",
    "Ramsey, Marshall": "https://digital.lib.utk.edu/static/iiif/collections/marshall_rftaart.json",
    "Wilson, Danny": "https://digital.lib.utk.edu/static/iiif/collections/danny_rftaart.json"
  }
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  /**
   * @todo: create graphql query to find related (or just 10 random) and IIIF collection endpoint
   */
  return (
    <>
      <h2>
        More Like <Label label={label} as="span" />
      </h2>
      <div>
        <BloomIIIF
          collectionId={bloom_values[artist]}
        />
      </div>
    </>
  );
};
export default Related;
