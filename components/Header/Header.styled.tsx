import { styled } from "@/stiches.config";

const Content = styled("div", {});

const Title = styled("span", {
  display: "flex",
  flexGrow: "1",
  alignItems: "center",
  fontWeight: "500",
});

const Wrapper = styled("header", {
  top: "0",
  width: "calc(100% - 4rem)",
  backgroundColor: "$globe",
  background: "linear-gradient(90deg, $globe 61.8%, $valley 100%)",
  padding: "1rem 2rem",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  color: "$indigo1",
  boxShadow: "3px 3px 8px #0002",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  alignItems: "center",

  [`&  ${Title} a`]: {
    textDecoration: "none",
    color: "$limestone",
    fontSize: "1.1rem",
    fontFamily: "$sans",
    fontWeight: "bold",
  },
});

export { Content, Title, Wrapper };
