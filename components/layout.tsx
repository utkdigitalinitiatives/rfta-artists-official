import React from "react";
import Head from "next/head";
import Header from "@/components/Header/Header";
import UTKHeader from "@/components/UTK_Header/UTKHeader"
import Footer from "@/components/Footer/Footer";
import Script from 'next/script'

export const siteTitle = "Next.js Sample Website";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
