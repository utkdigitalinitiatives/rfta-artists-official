import { styled } from "@/stiches.config";

const StyledAbout = styled("div", {
  maxWidth: "calc(100% - 4rem)",
  margin: "1rem auto 0",
  position: "relative",
  padding: "1rem 0 0",
  color: "$smokey",
  h1: {
    fontSize: "1.8rem",
    color: "#58595B",
    fontWeight: "500",
    margin: "0"
  },
  h2: {
    fontSize: "1.6rem",
    fontWeight: "400",
    letterSpacing: "0.5px",
    fontStyle: "italic",
    margin: "0",
    paddingTop: "2rem",
  },
  '.about-bordered-heading': {
    borderTop: "4px solid #ff8200",
  },
  p: {
    lineHeight: "2",
    fontSize: "1em",
    color: "#6A6A6A",
    letterSpacing: "0.5px",
    margin: "1rem 0"
  },
});

export { StyledAbout };