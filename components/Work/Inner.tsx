import {
  Label,
  Metadata,
  RequiredStatement,
  Summary,
} from "@samvera/nectar-iiif";
import { StyledWorkInner, WorkData } from "@/components/Work/Inner.styled"

interface ManifestData {
  label: any;
  metadata: any;
  requiredStatement: any;
  summary: any;
}

interface WorkInnerProps {
  manifest: ManifestData;
}

const WorkInner = ({ manifest }: WorkInnerProps) => {
  const { label, metadata, requiredStatement, summary } = manifest;

  return (
    <StyledWorkInner>
      <WorkData>
        <Label label={label} as="h1" />
        <Metadata metadata={metadata} />
        <RequiredStatement requiredStatement={requiredStatement} />
      </WorkData>
    </StyledWorkInner>
  );
};

export default WorkInner;