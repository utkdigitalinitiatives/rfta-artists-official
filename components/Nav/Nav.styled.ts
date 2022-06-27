import { styled } from "@/stiches.config";

const Highlight = styled("div", {
  backgroundColor: "$rock",
  position: "absolute",
  top: "0.25rem",
  left: "0",
  borderRadius: "0.5rem",
  height: "2rem",
  transition: "all 100ms ease-in-out",
});

const Items = styled("div", {
  display: "flex",
  alignItems: "center",
  marginRight: "0.5rem",

  a: {
    display: "inline-flex",
    color: "$limestone",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    marginRight: "0.5rem",
    borderRadius: "2rem",
    fontWeight: "300",
    position: "relative",
    transition: "all 100ms ease-in-out",
    fontSize: "1.1rem",
    letterSpacing: ".05em",

    [`&.active`]: {
      fontWeight: "500",
      color: "$limestone",
    },
  },
});

const Wrapper = styled("nav", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  zIndex: "1",
});

export { Highlight, Items, Wrapper };
