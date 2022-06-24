import { styled } from "@/stiches.config";

const RelatedWrapper = styled("div", {
  padding: "0 1.618rem 2rem",
});

const StyledRelated = styled("div", {
  margin: "auto",
  maxWidth: "1280px",
  position: "relative",
});

const OuterStyledRelated = styled("section", {
  backgroundColor: "$gray1",
  paddingTop: "1rem",
  boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075);",
});

export { StyledRelated, RelatedWrapper, OuterStyledRelated };