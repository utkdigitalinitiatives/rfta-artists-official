import React, { useEffect, useState } from "react";
import { getJsonByURI } from "@/services/utils";
import Figure from "@/components/Figure/Figure";
import { Wrapper } from "@/components/Hero/Hero.styled";

interface HeroManifest {
  items?: Array<{ items?: Array<{ items?: Array<{ body?: any }> }> }>;
  sequences?: Array<{ canvases?: Array<{ images?: Array<{ resource?: any }> }> }>;
}

const Hero = () => {
  const [hero, setHero] = useState<HeroManifest | undefined>();

  useEffect(() => {
    const heroUrls = process.env.hero as string[] | undefined;
    if (!heroUrls || heroUrls.length === 0) return;
    const random = Math.floor(Math.random() * heroUrls.length);
    getJsonByURI(heroUrls[random]).then((json: HeroManifest) => {
      setHero(json);
    });
  }, []);

  if (!hero) return null;

  let resource = null;

  /**
   * @todo: handle this better
   */
  if (hero.items) resource = hero.items?.[0]?.items?.[0]?.items?.[0]?.body;


   if (hero.sequences)
     resource = hero.sequences[0]?.canvases?.[0]?.images?.[0]?.resource;

  return (
    <Wrapper>
      <Figure resource={resource} region="250,950,2615,1200" size="20," />
    </Wrapper>
  );
};

export default Hero;
