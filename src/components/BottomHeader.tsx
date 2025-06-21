"use client";

import { CATEGORY_BY_SLUG, GET_PARENT_CATEGORIES, GET_SUBCATEGORIES } from "@/graphql/queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BottomHeader() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Query for all categories or a specific one
  const { data, loading, error } = useQuery(
    categorySlug ? CATEGORY_BY_SLUG : GET_PARENT_CATEGORIES,
    {
      variables: categorySlug ? { slug: categorySlug } : undefined,
      fetchPolicy: "cache-first",
    }
  );

  // Lazy query for subcategories
  const [fetchSubcategories, { data: subcategoriesData }] = useLazyQuery(GET_SUBCATEGORIES);

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

  const handleCategoryHover = (categoryId: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

      hoverTimeout.current = setTimeout(() => {
      setHoveredCategory(categoryId);
      fetchSubcategories({ variables: { parentCategoryId: categoryId } });
    }, 200); // 200ms delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredCategory(null);
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
    <div className="hidden md:block relative bg-white">
      <button 
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-0 h-full w-8 flex items-center justify-center bg-white z-10 hover:bg-gray-50"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      <div 
        ref={navRef}
        className="flex justify-center items-center pb-3 gap-x-6 lg:gap-x-8 px-10 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        <Link 
          href="/products" 
          className={`hover:text-gray-500 ${!activeCategory ? "text-gray-900 font-normal" : "text-gray-800"}`}
        >
          All Products
        </Link>
        
        {categoriesToDisplay.map((cat: { id: string; slug: string; name: string }) => (
          <div 
            key={cat.id}
            className="relative group"
            onMouseEnter={() => handleCategoryHover(cat.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/category/${cat.slug}`}
              className={`hover:text-gray-500 ${activeCategory === cat.slug ? "text-blue-600" : "text-gray-800 font-normal"}`}
            >
              {cat.name}
            </Link>
            
            {/* Subcategories dropdown */}
            {(hoveredCategory === cat.id && subcategoriesData?.subcategories?.length) && (
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-56 bg-white shadow-lg rounded-md z-20 border border-gray-100">
                <div className="py-2">
                  {subcategoriesData.subcategories.map((subcat: { id: string; slug: string; name: string }) => (
                    <Link
                      key={subcat.id}
                      href={`/category/${subcat.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setHoveredCategory(null)}
                    >
                      {subcat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-white z-10 hover:bg-gray-50"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}