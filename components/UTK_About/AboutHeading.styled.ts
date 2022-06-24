import { styled } from "@/stiches.config";

const StyledAbout = styled("div", {
  maxWidth: "1280px",
  margin: "1rem auto 0",
  position: "relative",
  padding: "1rem 0 0",
  color: "$smokey",
  h1: {
    fontSize: "2.5rem",
    textDecoration: "underline",
  },
  h2: {
    fontSize: "2rem",
  },
  p: {
    lineHeight: "2",
  }
});

export { StyledAbout };