import Head from 'next/head';
import { getValues } from "@/hooks/getValues";
import React, {useEffect, useState} from "react";
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";

interface MetatagProps {
  label: string | string[] | Record<string, string[]>;
  summary: string | string[] | Record<string, string[]>;
  thumbnail: string | Record<string, any> | null;
}

const Metatag = ({label, summary, thumbnail}: MetatagProps) => {
  const [baseUrl, setBaseUrl] = useState("");
  const router = useRouter();
  const canonicalUrl = (`https://rfta-artists.lib.utk.edu` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
  const labelValue = getValues(label);
  const summaryValue = getValues(summary);
  const labelText = Array.isArray(labelValue) ? labelValue[0] : String(labelValue);
  const summaryText = Array.isArray(summaryValue) ? summaryValue[0] : String(summaryValue);
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  return (
    <NextSeo
      title={labelText}
      description={summaryText}
      openGraph={
        {
          title: labelText,
          description: summaryText,
          url: canonicalUrl,
          images: [
            {
               url: Array.isArray(thumbnail) ? thumbnail[0]?.id : typeof thumbnail === 'object' && thumbnail ? thumbnail.id : '',
              alt: `Image of ${labelText}`
            }
          ]
        }
      }
    />
  );
};
export default Metatag;