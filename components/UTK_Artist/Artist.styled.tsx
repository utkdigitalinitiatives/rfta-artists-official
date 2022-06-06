import { styled } from "@/stiches.config";

const StyledArtistDescription = styled("div", {
  padding: "0px"
});

const StyledArtist = styled("section", {
  maxWidth: "1280px",
  margin: "auto",
  position: "relative",
  padding: "1rem 0 0",
  color: "$smokeyX",

  h2: {
    fontSize: "1.5rem",
  },

  span: {
    color: "$globe",
    textDecoration: "underline",
  },

});

export { StyledArtist, StyledArtistDescription };