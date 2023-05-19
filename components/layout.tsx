import React from "react";
import Header from "@/components/Header/Header";
import UTKHeader from "@/components/UTK_Header/UTKHeader"
import Footer from "@/components/Footer/Footer";
import Script from 'next/script'
import { useRouter } from "next/router";
import { NextSeo } from 'next-seo';
import Head from 'next/head';

export default function Layout({ children }) {
  const router = useRouter();
  const canonicalUrl = (`https://rfta-artists.lib.utk.edu` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
  return (
    <>
      <Head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DN6TP2L65T"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-DN6TP2L65T');
        </script>
      </Head>
      <NextSeo
        canonical={canonicalUrl}
        titleTemplate='RFTA: The Chimney Tops 2 Wildfires in Memory and Art | %s'
        defaultTitle='Rising from the Ashes: The Chimney Tops 2 Wildfires in Memory and Art'
        additionalLinkTags={
          [
            {
              rel: 'icon',
              href: '/images/favicon.ico',
            }
          ]
        }
        additionalMetaTags={
          [
            {
              name: 'google-site-verification',
              content: 'YieHBoOwo4bDE5mQqxSA_BH60F5zK0ePJns3eqLualA'
            }
          ]
        }
        twitter={
          {
            site: '@utklibraries',
            handle: '@utklibraries',
            cardType: 'summary_large_image'
          }
        }
      />
      <UTKHeader/>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
