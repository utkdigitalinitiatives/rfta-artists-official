import { getResourceImage } from "@/hooks/getResourceImage";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import clsx from "clsx";
import { LQIP, Wrapper } from "@/components/Figure/Figure.styled";

interface FigureProps {
  resource: Record<string, any> | null | undefined;
  region?: string;
  size?: string;
  isCover?: boolean;
}

const Figure = ({
  resource,
  region = "full",
  size = "400,",
  isCover = false,
}: FigureProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef && imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, []);

  let image: string | null = null;
  if (resource) image = getResourceImage(resource, size, region) || null;

  return (
    <Wrapper>
      <img
        src={image || undefined}
        ref={imgRef}
        style={
          isCover
            ? {
              objectFit: "cover",
              objectPosition: "50% 50%",
              width: "200px",
              height: "200px",
            }
            : {}
        }
        onLoad={() => setLoaded(true)}
        className={clsx("source", loaded && "loaded")}
      />
    </Wrapper>
  );
};

export default Figure;
