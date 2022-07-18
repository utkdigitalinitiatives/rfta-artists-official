import Head from 'next/head';
import { getValues } from "@/hooks/getValues";
import React, {useEffect, useState} from "react";
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";

const Metatag = ({label, summary, thumbnail}) => {
  const [baseUrl, setBaseUrl] = useState("");
  const router = useRouter();
  const canonicalUrl = (`https://rfta-artists.lib.utk.edu` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
  const labelValue = getValues(label);
  const summaryValue = getValues(summary);
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  return (
    <NextSeo
      title={labelValue}
      description={summaryValue}
      openGraph={
        {
          title: labelValue,
          description: summaryValue,
          url: canonicalUrl,
          images: [
            {
              url: thumbnail[0].id,
              alt: `Image of ${labelValue}`
            }
          ]
        }
      }
    />
  );
};
export default Metatag;