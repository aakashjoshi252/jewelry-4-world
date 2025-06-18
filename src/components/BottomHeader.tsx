"use client";

import { CATEGORY_BY_SLUG, GET_PARENT_CATEGORIES } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

export default function BottomHeader() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery(
    categorySlug ? CATEGORY_BY_SLUG : GET_PARENT_CATEGORIES,
    {
      variables: categorySlug ? { slug: categorySlug } : undefined,
      fetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    if (categorySlug && data?.categoryBySlug) {
      setActiveCategory(data.categoryBySlug.slug);
    } else {
      setActiveCategory(null);
    }
  }, [categorySlug, data]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'right' 
        ? scrollPosition + scrollAmount
        : scrollPosition - scrollAmount;
      
      navRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  if (loading) return <div className="h-12 bg-white"></div>;
  if (error) {
    console.error("Error fetching categories:", error);
    return <div className="h-12 bg-white text-red-500">Error loading categories</div>;
  }

  const categoriesToDisplay = categorySlug && data?.categoryBySlug
    ? [data.categoryBySlug]
    : data?.parentCategories || [];

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden w-full py-3 px-4 flex items-center justify-between bg-white"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <span className="font-medium text-gray-800">
          {activeCategory 
            ? categoriesToDisplay.find((c: any) => c.slug === activeCategory)?.name 
            : "All Categories"}
        </span>
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:block relative bg-white">
        {/* Scroll buttons - only show if content overflows */}
        <button 
          onClick={() => handleScroll('left')}
          className={`absolute left-0 top-0 h-full w-8 flex items-center justify-center bg-white z-10 hover:bg-gray-50 ${scrollPosition <= 0 ? 'opacity-30 cursor-default' : ''}`}
          aria-label="Scroll left"
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div 
          ref={navRef}
          className="flex justify-center items-center gap-x-4 lg:gap-x-6 xl:gap-x-8 px-10 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          <Link 
            href="/products" 
            className={`text-sm lg:text-base px-2 py-1 rounded hover:bg-gray-50 ${!activeCategory ? "text-blue-600 font-semibold" : "text-gray-800"}`}
          >
            All Products
          </Link>
          
          {categoriesToDisplay.map((cat: { slug: string; name: string }) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`text-sm lg:text-base px-2 py-1 rounded hover:bg-gray-50 ${activeCategory === cat.slug ? "text-blue-600 font-semibold" : "text-gray-800"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          className={`absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-white z-10 hover:bg-gray-50 ${navRef.current && scrollPosition >= navRef.current.scrollWidth - navRef.current.clientWidth ? 'opacity-30 cursor-default' : ''}`}
          aria-label="Scroll right"
          disabled={navRef.current ? scrollPosition >= navRef.current.scrollWidth - navRef.current.clientWidth : true}
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="py-2">
            <Link 
              href="/products" 
              className={`block px-4 py-3 ${!activeCategory ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-800"}`}
              onClick={() => setShowMobileMenu(false)}
            >
              All Products
            </Link>
            
            {categoriesToDisplay.map((cat: { slug: string; name: string }) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`block px-4 py-3 ${activeCategory === cat.slug ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-800"}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}