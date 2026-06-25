import dynamic from "next/dynamic";

const CloverIIIF = dynamic(() => import("@samvera/clover-iiif"), {
  ssr: false,
}) as any;

const options = {
  showTitle: true,
  showIIIFBadge: true,
  scrollToZoom: false,
};

const Viewer = ({ manifestId }: { manifestId: string }) => (
  <CloverIIIF manifestId={manifestId} options={options} />
);
export default Viewer;
