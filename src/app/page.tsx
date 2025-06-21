/* eslint-disable @next/next/no-page-custom-font */
"use client";

import Bheader from "@/components/Header";
import Carousel from "@/components/Carousel";
import Head from "next/head";
// import FeaturedProducts from "@/components/FeaturedProducts"; // Mostly top products
import Footer from "@/components/Footer";
import OffersPage from "./offers/page";
import ShopByCategories from "./shopbyCategories/page";
import TopRatedProducts from "./products/topratedprod";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Gidole&display=swap" rel="stylesheet" />
      </Head>
      <header>
        <Bheader />
      </header> 
      <Carousel/>
      <ShopByCategories/>
      <OffersPage/>
      <TopRatedProducts/>
      <Footer/>
    </>
  );
}