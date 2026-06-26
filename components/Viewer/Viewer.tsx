import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  LoadingSpinner,
  LoadingText,
  ViewerLoadingOverlay,
  ViewerShell,
} from "@/components/Viewer/Viewer.styled";

const CloverIIIF = dynamic(() => import("@samvera/clover-iiif"), {
  ssr: false,
}) as any;

const IMAGE_PHASE_DELAY_MS = 1200;
const SLOW_PHASE_DELAY_MS = 6000;

const options = {
  showTitle: true,
  showIIIFBadge: true,
  scrollToZoom: false,
};

type LoadingPhase = "viewer" | "image" | "slow";

const phaseText = (phase: LoadingPhase) => {
  if (phase === "viewer") return "Loading viewer...";
  if (phase === "image") return "Loading image...";
  return "Still loading image...";
};

const Viewer = ({ manifestId }: { manifestId: string }) => {
  const [imageReady, setImageReady] = useState(false);
  const [phase, setPhase] = useState<LoadingPhase>("viewer");

  useEffect(() => {
    setImageReady(false);
    setPhase("viewer");

    const imagePhaseTimer = window.setTimeout(() => {
      setPhase("image");
    }, IMAGE_PHASE_DELAY_MS);

    const slowPhaseTimer = window.setTimeout(() => {
      setPhase("slow");
    }, SLOW_PHASE_DELAY_MS);

    return () => {
      clearTimeout(imagePhaseTimer);
      clearTimeout(slowPhaseTimer);
    };
  }, [manifestId]);

  useEffect(() => {
    const controller = new AbortController();

    // Warm the manifest request while Clover initializes so users wait less.
    fetch(manifestId, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    }).catch(() => undefined);

    return () => {
      controller.abort();
    };
  }, [manifestId]);

  return (
    <ViewerShell aria-busy={!imageReady}>
      {!imageReady && (
        <ViewerLoadingOverlay role="status" aria-live="polite" aria-atomic>
          <LoadingSpinner aria-hidden="true" />
          <LoadingText>{phaseText(phase)}</LoadingText>
        </ViewerLoadingOverlay>
      )}
      <CloverIIIF
        id="work-viewer"
        manifestId={manifestId}
        options={options}
        canvasIdCallback={(canvasId: string) => {
          if (canvasId) setImageReady(true);
        }}
      />
    </ViewerShell>
  );
};

export default Viewer;
