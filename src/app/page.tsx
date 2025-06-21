/* eslint-disable @next/next/no-page-custom-font */
"use client";

import Bheader from "@/components/Header";
import Carousel from "@/components/Carousel";
import Head from "next/head";
import ProductsPage from "../app/products/page";
import Footer from "@/components/Footer";

export default function Home() {
    
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Gidole&display=swap" rel="stylesheet" />
      </Head>
      <Bheader />
      
        <Carousel/>
      <div className="flex min-h-screen bg-white text-gray-900" style={{ fontFamily: 'Gidole, sans-serif' }}>
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Display All Products */}
          <ProductsPage /> 
        </main>
      </div>
      <Footer/>
    </>
  );
}
