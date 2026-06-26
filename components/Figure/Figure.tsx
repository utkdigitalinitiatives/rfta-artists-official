import { getResourceImage } from "@/hooks/getResourceImage";
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { LQIP, Wrapper } from "@/components/Figure/Figure.styled";

const Figure = ({
  resource,
  region = "full",
  size = "400,",
  isCover = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  let image = null;
  if (resource) image = getResourceImage(resource, size, region);

  useEffect(() => {
    setLoaded(false);
    setSrc(image || "/images/placeholder.png");
  }, [image]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <Wrapper>
      <img
        src={src || "/images/placeholder.png"}
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
        onError={() => {
          if (src !== "/images/placeholder.png") {
            setSrc("/images/placeholder.png");
            return;
          }
          setLoaded(true);
        }}
        className={clsx("source", loaded && "loaded")}
      />
    </Wrapper>
  );
};

export default Figure;
