declare module "@iiif/vault" {
  export class Vault {
    loadManifest(id: string): Promise<any>;
  }
}

declare module "@samvera/bloom-iiif" {
  const BloomIIIF: any;
  export default BloomIIIF;
}

declare module "@samvera/clover-iiif" {
  const CloverIIIF: any;
  export default CloverIIIF;
}

declare module "@hyperion-framework/types" {
  export type InternationalString = Record<string, string[]>;
}
