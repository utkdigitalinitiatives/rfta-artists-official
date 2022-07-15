import { styled } from "@/stiches.config";

const WorkData = styled("div", { 
  padding: "0 2rem",
  maxWidth: "calc(100% - 4rem)"
});

const StyledWorkInner = styled("section", {
  maxWidth: "100%",
  position: "relative",
  padding: "1rem 0 0",

  dl: {
    dt: {
      fontSize: "1rem",
      fontWeight: "bold",
      paddingBottom: "0.5rem",
      textTransform: "uppercase",
    },
    dd: {
      marginInlineStart: "0",
      paddingBottom: "1.25rem",

      a: {
        color: "$globe",
      },

      "a:visited": {
        color: "$regalia",
      },

      img: {
        maxWidth: "25%",
      },

      span: {
        display: "block",
        paddingBottom: "1rem",
      }
    }
  },
});

export { StyledWorkInner, WorkData };