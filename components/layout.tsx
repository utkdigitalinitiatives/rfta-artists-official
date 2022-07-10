import React from "react";
import Head from "next/head";
import Header from "@/components/Header/Header";
import UTKHeader from "@/components/UTK_Header/UTKHeader"
import Footer from "@/components/Footer/Footer";

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
    </>
  );
}
