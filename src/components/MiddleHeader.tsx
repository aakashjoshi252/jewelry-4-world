"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, Heart, Menu } from "lucide-react";

export default function MiddleHeader() {
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?query=${encodeURIComponent(search)}`);
      setShowMobileSearch(false); // Hide search after submission on mobile
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 md:px-6 md:py-4 bg-white">
      {/* Top Row - Mobile Only */}
      <div className="w-full md:hidden flex justify-between items-center mb-3">
        <button className="text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Jewelry Store
        </Link>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="text-gray-700"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link href="/wishlist" className="hover:text-blue-600">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="hover:text-blue-600">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Logo - Hidden on mobile, shown on desktop */}
      <Link 
        href="/" 
        className="hidden md:block text-3xl lg:text-4xl font-bold text-gray-800"
      >
        Jewelry Store
      </Link>

      {/* Search Form - Different layout for mobile */}
      {showMobileSearch ? (
        // Mobile search form (full width when active)
        <form
          onSubmit={handleSearch}
          className="w-full md:hidden flex items-center gap-2 mb-3"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none text-base"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      ) : (
        // Desktop search form
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 flex-1 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-4 lg:mx-6"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 lg:py-3 w-full rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none text-base"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-full hover:bg-blue-700 text-sm lg:text-base flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">Search</span>
          </button>
        </form>
      )}

      {/* Icons - Hidden on mobile (shown in top row) */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6">
        <Link href="/wishlist" className="hover:text-blue-600 flex items-center gap-1">
          <Heart className="w-2 h-5" />
          <span className="hidden xl:inline text-sm">Wishlist</span>
        </Link>
        <Link href="/cart" className="hover:text-blue-600 flex items-center gap-1">
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden xl:inline text-sm">Cart</span>
        </Link>
      </div>
    </div>
  );
}