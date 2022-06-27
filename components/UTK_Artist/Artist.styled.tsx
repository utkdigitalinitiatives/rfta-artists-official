import { styled } from "@/stiches.config";

const StyledArtistDescription = styled("div", {
  padding: "0px",
  letterSpacing: ".5px",
  lineHeight: "2"
});

const StyledArtist = styled("section", {
  maxWidth: "1280px",
  margin: "auto",
  position: "relative",
  padding: "2rem 0 0",
  color: "$smokeyX",
  boxShadow: "0 15px 10px -15px rgba(51,51,51,.15)",

  h2: {
    fontSize: "1.2rem",
    color: "$smokey",
    textTransform: "uppercase"
  },

  span: {
    color: "$globe",
    textDecoration: "underline",
  },

});

export { StyledArtist, StyledArtistDescription };