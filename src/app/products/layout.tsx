"use client";

import { ReactNode } from "react";
import Bheader from "@/components/Header";
import Slidebar from "@/components/Slidebar";
import Footer from "@/components/Footer";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Bheader />
      <div className="flex min-h-screen">
        <div className="sticky top-0 self-start">
          <Slidebar />
        </div>
        <main className="flex-1 overflow-auto px-4 pb-20">{children}</main>
      </div>
      <Footer />
    </>
  );
}
