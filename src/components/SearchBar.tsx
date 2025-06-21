"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

interface SearchBarProps {
  onSellerSearch: (value: string) => void;
}

export default function SearchBar({ onSellerSearch }: SearchBarProps) {
  const [term, setTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSellerSearch(value);
  };

  return (
    <div className="bg-white shadow py-4 md:py-6 px-4 relative">
      <div className="flex items-center justify-between max-w-8xl mx-auto">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="text-2xl md:text-4xl font-bold text-gray-800">Jewelry Store</div>
        
        <input
          type="text"
          placeholder="Search your products..."
          value={term}
          onChange={handleChange}
          className="w-full max-w-2xl ml-4 md:ml-8 px-4 md:px-6 py-2 md:py-3 text-sm md:text-md border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 p-4">
            <div className="flex flex-col space-y-3">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded">
                Dashboard
              </Link>
              <Link href="/products" className="p-2 hover:bg-gray-100 rounded">
                All Products
              </Link>
              <Link href="/add-product" className="p-2 hover:bg-gray-100 rounded">
                Add Product
              </Link>
              <Link href="/orders" className="p-2 hover:bg-gray-100 rounded">
                Orders
              </Link>
              <Link href="/profile" className="p-2 hover:bg-gray-100 rounded">
                Profile
              </Link>
              <Link href="/settings" className="p-2 hover:bg-gray-100 rounded">
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}