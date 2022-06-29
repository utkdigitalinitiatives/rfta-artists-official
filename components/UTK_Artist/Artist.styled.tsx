import { styled } from "@/stiches.config";

const StyledArtistDescription = styled("div", {
  padding: "0",
  margin: "0",
  letterSpacing: ".5px",
  lineHeight: "2",
  fontSize: "1em",
  color: "#6A6A6A"
});

const StyledArtist = styled("section", {
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  color: "$smokeyx",
  boxShadow: "0 15px 10px -15px rgba(51,51,51,.15)",

  h3: {
    fontSize: "1.2rem",
    color: "#6A6A6A",
    textTransform: "uppercase",
    margin: "0 0 1rem 0",
    paddingTop: "2rem",
  },

  span: {
    color: "$globe",
    textDecoration: "underline",
  },

});

export { StyledArtist, StyledArtistDescription };