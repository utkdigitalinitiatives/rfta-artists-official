declare module "@samvera/bloom-iiif" {
    import React from "react";
    interface BloomIIIFProps {
        collectionId?: string;
        [key: string]: any;
    }
    const BloomIIIF: React.ComponentType<BloomIIIFProps>;
    export default BloomIIIF;
}
