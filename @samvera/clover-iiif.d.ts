declare module "@samvera/clover-iiif" {
    import React from "react";
    interface CloverIIIFProps {
        manifestId: string;
        options?: Record<string, any>;
        [key: string]: any;
    }
    const CloverIIIF: React.ComponentType<CloverIIIFProps>;
    export default CloverIIIF;
}
