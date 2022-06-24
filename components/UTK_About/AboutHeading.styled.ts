import { styled } from "@/stiches.config";

const StyledAbout = styled("div", {
  maxWidth: "1280px",
  margin: "1rem auto 0",
  position: "relative",
  padding: "1rem 0 0",
  h1: {
    fontSize: "2.5rem",
    color: "$smokey",
    textDecoration: "underline",
  }
});

export { StyledAbout };