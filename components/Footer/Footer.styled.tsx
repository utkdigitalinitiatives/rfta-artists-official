import { styled } from "@/stiches.config";

const Wrapper = styled("footer", {
    width: "calc(100% - 4rem)",
    backgroundColor: "$limestone",
    padding: "2rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    h2: {
      fontSize: "1.6rem",
      color: "#58595B",
      fontWeight: "400",
      margin: "0",
      letterSpacing: "0.5px"
    },
    a: {
      color: "$globe"
    }
});

const Funding = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  p: {
    color: "$smokey",
    fontWeight: "400"
  },
  img: {
    maxWidth: "275px"
  }
});

export { Wrapper, Funding };
