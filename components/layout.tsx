import React from "react";
import Header from "@/components/Header/Header";
import UTKHeader from "@/components/UTK_Header/UTKHeader"
import Footer from "@/components/Footer/Footer";
import Script from 'next/script'
import { useRouter } from "next/router";
import { NextSeo } from 'next-seo';

export default function Layout({ children }) {
  const router = useRouter();
  const canonicalUrl = (`https://rfta-artists.lib.utk.edu` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
  return (
    <>
      <NextSeo
        canonical={canonicalUrl}
        titleTemplate='RFTA: The Chimney Tops 2 Wildfires in Memory and Art | %s'
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
      <div className="container">
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-5931387-33', 'auto');
          ga('send', 'pageview');
        `}
        </Script>
      </div>
    </>
  );
}
