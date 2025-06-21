/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Range } from "react-range";
import { useCurrency } from "../providers/CurrencyContext";
import { convertPrice } from "../lib/currencyConverter";
import { X, Menu, User, SlidersHorizontal } from "lucide-react";

const MAX_PRICE = 10000;

export default function Slidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initialMinPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!, 10)
    : 0;
  const initialMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!, 10)
    : MAX_PRICE;

  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [isOpen, setIsOpen] = useState(!isMobile); // Closed by default on mobile

  const { currency } = useCurrency();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    router.push(`?${params.toString()}`);
  }, [priceRange, router]);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('aside');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
      )}

      <aside
        className={`
          ${isOpen ? 'w-64' : 'w-16'} 
          ${isMobile ? 'fixed' : 'relative'}
          h-screen bg-gray-600 text-white p-4 flex flex-col transition-all duration-300 ease-in-out z-50
          ${isMobile && !isOpen ? '-translate-x-full md:translate-x-0' : ''}
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-3 right-4 text-white bg-gray-700 rounded-full p-1 hover:bg-gray-600"
          title={isOpen ? "Collapse" : "Expand"}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="mt-8 space-y-4">
          {/* Profile Link */}
          <a
            href="/auth/userprofile"
            className={`
              flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition-colors
              ${isOpen ? '' : 'justify-center'}
            `}
            title="Profile"
          >
            <User className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span>Profile</span>}
          </a>

          {/* Price Filter Section */}
          <div>
            <div
              className={`
                flex items-center gap-2 p-3 text-white font-semibold cursor-pointer
                ${!isOpen ? 'justify-center' : ''}
              `}
              onClick={() => isMobile && setIsOpen(true)}
              title="Filter by Price"
            >
              <SlidersHorizontal className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>Filter by Price</span>}
            </div>

            {isOpen && (
              <div className="mt-2 px-2">
                <Range
                  step={100}
                  min={0}
                  max={MAX_PRICE}
                  values={priceRange}
                  onChange={(values) => setPriceRange(values)}
                  renderTrack={({ props, children }) => (
                    <div {...props} className="h-2 bg-gray-400 rounded-full relative">
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={index}
                        {...restProps}
                        className="w-5 h-5 bg-blue-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    );
                  }}
                />
                <div className="mt-2 text-center text-sm">
                  {currency} {convertPrice(priceRange[0], currency).toFixed(2)} - {currency}{" "}
                  {convertPrice(priceRange[1], currency).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile toggle button when sidebar is closed */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-40 bg-gray-600 text-white p-3 rounded-full shadow-lg md:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-6 w-6" />
        </button>
      )}
    </>
  );
}