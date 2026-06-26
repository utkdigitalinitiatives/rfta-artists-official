import { keyframes, styled } from "@/stiches.config";

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

const pulse = keyframes({
  "0%": { opacity: 0.65 },
  "50%": { opacity: 1 },
  "100%": { opacity: 0.65 },
});

export const ViewerShell = styled("section", {
  position: "relative",
  minHeight: "61.8vh",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #d8e0e8",
  background: "#f4f8fb",
});

export const ViewerLoadingOverlay = styled("div", {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  textAlign: "center",
  padding: "1rem",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(246, 250, 253, 0.95))",
});

export const LoadingSpinner = styled("span", {
  width: "2rem",
  height: "2rem",
  borderRadius: "999px",
  border: "2px solid #adc1d4",
  borderTopColor: "#2d5f85",
  animation: `${spin} 900ms linear infinite`,
});

export const LoadingText = styled("p", {
  margin: 0,
  color: "#24415c",
  fontWeight: 500,
  fontSize: "0.95rem",
  letterSpacing: "0.01em",
  animation: `${pulse} 1500ms ease-in-out infinite`,
});
