"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useQuery } from "@apollo/client";
import { WE_QUERY } from "../graphql/queries";

export default function MiddleHeader() {
  const [search, setSearch] = useState("");
  const { data: meData } = useQuery(WE_QUERY);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const username = meData?.we?.username;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="px-4 md:px-6 py-4">
      {/* Mobile top bar */}
      <div className="flex md:hidden justify-between items-center mb-4">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-800 hover:text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="text-2xl font-light text-gray-900 tracking-tight">
          Jewelry
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/wishlist" className="text-gray-800 hover:text-gray-600">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="text-gray-800 hover:text-gray-600">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Desktop layout - unchanged */}
      <div className="hidden md:flex justify-between items-center">
        <Link href="/" className="text-3xl lg:text-4xl font-bold text-gray-800">
          Jewelry Store
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 flex-1 max-w-2xl lg:max-w-4xl mx-4 lg:mx-6"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 lg:py-3 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm lg:text-base"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 lg:px-9 py-2 lg:py-3 rounded-full hover:bg-gray-700 text-sm lg:text-md flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">Search</span>
          </button>
        </form>

        <div className="flex items-center gap-3 lg:gap-4">
          <Link href="/wishlist" className="hover:text-gray-600 hidden lg:block">
            <Heart className="w-6 h-6" />
          </Link>
          <Link href="/cart" className="hover:text-gray-600">
            <ShoppingCart className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <form
        onSubmit={handleSearch}
        className="md:hidden mt-4 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-6 py-4 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          <Search className="w-6 h-6" />
        </button>
      </form>

      {/* Mobile menu with specific profile link */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
             />
          
          {/* Menu panel */}
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-4 flex items-center justify-between border-b">
              <Link href="/" className="text-xl font-light text-gray-900">
                Jewelry
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="overflow-y-auto h-full pb-20">

              {/* Collections Section */}
              <div className="py-2">
              <h3 className="px-4 py-3 text-sm font-light text-gray-500 uppercase tracking-wider">
                  <Link href={"/"}>Home</Link>
                </h3>
                <h3 className="px-4 py-3 text-sm font-light text-gray-500 uppercase tracking-wider">
                  Collections
                </h3>

                <div className="flex flex-col">
                    <Link className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-light border-b" href={"/products"}>
                      All Products
                    </Link>
                </div>

                <div className="flex flex-col">
                  {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((item) => (
                    <Link
                      key={item}
                      href={`/category/${item.toLowerCase()}`}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-light border-b"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Account Section */}
              <div className="py-2">
                <h3 className="px-4 py-3 text-sm font-light text-gray-500 uppercase tracking-wider">
                  Account
                </h3>
                <div className="flex flex-col">
                  {['Profile'].map((user) => (
                    <Link
                      key={user}
                      href={`/auth/userprofile/${username}`}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-light border-b"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {user}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col">
                    <Link
                      href={`/wishlist`}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-light border-b"
                    >
                      Wishlist
                    </Link>
                </div>
                <div className="flex flex-col">
                    <Link
                      href={`/orders`}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-light border-b"
                    >
                      Orders
                    </Link>
                </div>
                <div className="flex flex-col">
                  {['Settings'].map((item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-light border-b"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Auth Buttons */}
              <div className="p-4 mt-4">
                <Link 
                  href="/auth/login" 
                  className="block w-full text-center py-3 px-4 rounded-full mb-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-light"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block w-full text-center py-3 px-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 font-light"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}