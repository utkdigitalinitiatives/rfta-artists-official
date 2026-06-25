import BloomIIIF from "@samvera/bloom-iiif";
import { useEffect, useState } from "react";
import { Label } from "@samvera/nectar-iiif";
import { StyledRelated, RelatedWrapper, OuterStyledRelated } from "@/components/Related/Related.styled"

const Related = ({ label, artist }) => {
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const bloom_values = {
    "Braddock, Paige": "/api/iiif/collection/paige-rftaart",
    "Daniel, Charles R. (Charlie), Jr., 1929-": "/api/iiif/collection/charlie-rftaart",
    "Ramsey, Marshall": "/api/iiif/collection/marshall-rftaart",
    "Wilson, Danny": "/api/iiif/collection/danny-rftaart"
  }

  useEffect(() => {
    const collectionPath = bloom_values[artist];
    if (!collectionPath) {
      setCollectionId(null);
      return;
    }

    setCollectionId(new URL(collectionPath, window.location.origin).toString());
  }, [artist]);

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
            {collectionId && (
              <BloomIIIF collectionId={collectionId} />
            )}
          </div>
        </RelatedWrapper>
      </StyledRelated>
    </OuterStyledRelated>
  );
};
export default Related;
