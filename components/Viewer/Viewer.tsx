import dynamic from "next/dynamic";
import React from "react";

const CloverIIIF: React.ComponentType<{ manifestId: string }> = dynamic(
  () => import("@samvera/clover-iiif"),
  {
    ssr: false,
  }
);

interface ViewerProps {
  manifestId: string;
}

const Viewer = ({ manifestId }: ViewerProps) => (
  <CloverIIIF manifestId={manifestId} />
);
export default Viewer;
