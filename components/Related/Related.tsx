import BloomIIIF from "@samvera/bloom-iiif";
import { useEffect, useState } from "react";
import { Label } from "@samvera/nectar-iiif";
import {
  StyledRelated,
  RelatedWrapper,
  OuterStyledRelated,
} from "@/components/Related/Related.styled";

interface RelatedProps {
  label: any;
  artist: string;
}

const Related = ({ label, artist }: RelatedProps) => {
  const [baseUrl, setBaseUrl] = useState("");
  const bloom_values: Record<string, string> = {
    "Braddock, Paige":
      "https://digital.lib.utk.edu/assemble/collection/collections/paige_rftaart",
    "Daniel, Charles R. (Charlie), Jr., 1929-":
      "https://digital.lib.utk.edu/assemble/collection/collections/charlie_rftaart",
    "Ramsey, Marshall":
      "https://digital.lib.utk.edu/assemble/collection/collections/marshall_rftaart",
    "Wilson, Danny":
      "https://digital.lib.utk.edu/assemble/collection/collections/danny_rftaart",
  };
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  /**
   * @todo: create graphql query to find related (or just 10 random) and IIIF collection endpoint
   */
  return (
    <OuterStyledRelated>
      <StyledRelated>
        <RelatedWrapper>
          <h2>
            More like "<Label label={label} as="span" />"
          </h2>
          <div>
            <BloomIIIF collectionId={bloom_values[artist]} />
          </div>
        </RelatedWrapper>
      </StyledRelated>
    </OuterStyledRelated>
  );
};
export default Related;
