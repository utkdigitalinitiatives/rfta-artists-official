import dynamic from "next/dynamic";

const CloverIIIF: React.ComponentType<{ manifestId: string }> = dynamic(
  () => import("@samvera/clover-iiif"),
  {
    ssr: false,
  }
);

const options = {
  showTitle: true,
  showIIIFBadge: true,
  scrollToZoom: false,
};

const Viewer = ({ manifestId }) => (
  <CloverIIIF manifestId={manifestId} options={options} />
);
export default Viewer;
