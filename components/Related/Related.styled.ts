import { styled } from "@/stiches.config";

const RelatedWrapper = styled("div", {
  padding: "0 2rem",
  maxWidth: "calc(100% - 4rem)",
});

const StyledRelated = styled("div", {
  margin: "auto",
  maxWidth: "100%",
  position: "relative",
});

const OuterStyledRelated = styled("section", {
  backgroundColor: "$gray1",
  paddingTop: "1rem",
  boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075);",
});

export { StyledRelated, RelatedWrapper, OuterStyledRelated };