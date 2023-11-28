import { styled, media } from "@/stiches.config";

const Content = styled("div", {});

const TitleWrapper = styled("div", {
  display: "flex",
  flexDirection: "column"
});

const Title = styled("span", {
  display: "flex",
  flexGrow: "1",
  alignItems: "center",
  fontWeight: "400",
});

const Subtitle = styled("span", {
  display: "flex",
  flexGrow: "1",
  fontWeight: "400",
  fontSize: "1em",
  textTransform: "uppercase",
  letterSpacing: ".05em"
});

const Wrapper = styled("header", {
  top: "0",
  width: "calc(100% - 4rem)",
  backgroundColor: "$globe",
  padding: "2rem",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  boxShadow: "3px 3px 8px #0002",
  fontSize: "1rem",
  lineHeight: "2.2rem",
  alignItems: "center",

  [`&  ${Title} a`]: {
    textDecoration: "none",
    color: "$limestone",
    fontSize: "2rem",
    fontFamily: "Montserrat",
    letterSpacing: "0.7px"
  },

  [`&  ${Subtitle} a`]: {
    textDecoration: "none",
    color: "$limestone",
  },
});

export { Content, Title, Subtitle, Wrapper, TitleWrapper };
