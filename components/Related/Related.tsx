import BloomIIIF from "@samvera/bloom-iiif";
import { useEffect, useState } from "react";
import { Label } from "@samvera/nectar-iiif";
import { StyledRelated, RelatedWrapper, OuterStyledRelated } from "@/components/Related/Related.styled"

interface RelatedProps {
  label: any;
  artist: string;
}

const Related = ({ label, artist }: RelatedProps) => {
  const [baseUrl, setBaseUrl] = useState("");
  const bloom_values: Record<string, string> = {
    "Braddock, Paige": "/api/iiif/collection/paige-rftaart",
    "Daniel, Charles R. (Charlie), Jr., 1929-": "/api/iiif/collection/charlie-rftaart",
    "Ramsey, Marshall": "/api/iiif/collection/marshall-rftaart",
    "Wilson, Danny": "/api/iiif/collection/danny-rftaart"
  }
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  const collectionId = baseUrl ? `${baseUrl}${bloom_values[artist]}` : undefined;

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
            {collectionId && <BloomIIIF collectionId={collectionId} />}
          </div>
        </RelatedWrapper>
      </StyledRelated>
    </OuterStyledRelated>
  );
};
export default Related;
