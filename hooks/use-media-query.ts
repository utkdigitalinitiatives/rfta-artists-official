import { useEffect, useState } from "react";

export const useMediaQuery = (mediaQuery: string) => {
  const [isMatch, setIsMatch] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(mediaQuery);
    setIsMatch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMatch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mediaQuery]);

  return isMatch;
};
