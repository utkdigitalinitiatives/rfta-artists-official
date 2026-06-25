import Head from "next/head";
import { getValues } from "@/hooks/getValues";
import React, { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { normalizeIiifUrl } from "@/services/iiif-url";

const Metatag = ({ label, summary, thumbnail }) => {
  const [baseUrl, setBaseUrl] = useState("");
  const router = useRouter();
  const canonicalUrl = (
    `https://rfta-artists.lib.utk.edu` +
    (router.asPath === "/" ? "" : router.asPath)
  ).split("?")[0];
  const labelValue = getValues(label)?.[0] || "";
  const summaryValue = getValues(summary)?.[0] || "";
  const thumbnailUrl = thumbnail?.[0]?.id
    ? normalizeIiifUrl(thumbnail[0].id)
    : undefined;
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  return (
    <NextSeo
      title={labelValue}
      description={summaryValue}
      openGraph={{
        title: labelValue,
        description: summaryValue,
        url: canonicalUrl,
        images: [
          {
            url: thumbnailUrl,
            alt: `Image of ${labelValue}`,
          },
        ],
      }}
    />
  );
};
export default Metatag;
