import Head from 'next/head';
import { getValues } from "@/hooks/getValues";
import React, {useEffect, useState} from "react";

const Metatag = ({label, summary, thumbnail}) => {
  const [baseUrl, setBaseUrl] = useState("");
  const labelValue = getValues(label);
  const summaryValue = getValues(summary);
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  return (
    <Head>
      <meta property="og:title" content={labelValue} key="title" />
      <meta property="og:description" content={summaryValue} key="summary" />
      <meta property="og:image" content={thumbnail[0].id} key="og-image" />
      <meta name="description" content={summaryValue} key="description" />
      <meta name="twitter:title" content={labelValue} key="twitter-title" />
      <meta name="twitter:description" content={summaryValue} key="twitter-summary" />
      <meta name="twitter:image" content={thumbnail[0].id} key="twitter-image" />
      <meta name="twitter:image:alt" content={labelValue} key="twitter-image-alt" />
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:site" content="@utklibraries" key="twitter-site" />
      <meta name="twitter:creator" content="@utklibraries" key="twitter-creator" />
    </Head>
  );
};
export default Metatag;