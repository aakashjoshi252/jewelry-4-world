/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { FILTERED_PRODUCTS_QUERY, ALL_PRODUCTS_QUERY } from "../../graphql/queries";
import { ADD_TO_WISHLIST } from "../../graphql/mutations";
import { GET_WISHLISTS } from "../../graphql/queries";
import { useCurrency } from "../../providers/CurrencyContext";
import { convertPrice } from "../../lib/currencyConverter";
import { formatCurrency } from "../../lib/formatCurrency";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import TopRatedProducts from "./topratedprod";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const [, setHoveredProduct] = useState<string | null>(null);
  const { data: wishlistData } = useQuery(GET_WISHLISTS);
  const wishlistItems = wishlistData?.getWishlist?.items || [];
  const searchQuery = searchParams.get("query");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const material = searchParams.get("material");
  const category = searchParams.get("category");

  const [addtoWishlist] = useMutation(ADD_TO_WISHLIST);

  const { data, loading, error } = useQuery(
    searchQuery || minPrice || maxPrice || material || category
      ? FILTERED_PRODUCTS_QUERY
      : ALL_PRODUCTS_QUERY,
    {
      variables: {
        search: searchQuery || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        material: material || undefined,
        category: category || undefined,
      },
    }
  );

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item: any) => item.product.id === productId);
  };

  const wishlist = async (productId: string) => {
    try {
      await addtoWishlist({
        variables: {
          productId,
        },
      });
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.log(err);
    }
  };

  const products = data?.filteredProducts || data?.allProducts || [];
  const isSearching = searchQuery || minPrice || maxPrice || material || category;

  return (
    <div className="bg-gray-50">
      <main className="px-4 sm:px-6 pb-12 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2 pt-5 tracking-tight">
            {/* {searchQuery ? `Search Results for "${searchQuery}"` : "Our Collection"} */}
          </h1>
          {/* <p className="text-gray-500 font-light">
            {searchQuery ? "" : "Discover our premium selection of products"}
          </p> */}
        </div>

        {!isSearching && (
          <>
            <TopRatedProducts />
            <div>
              <h1 className="text-xl font-light text-gray-800 mb-6 tracking-tight text-center">
                Our recently added
              </h1>
            </div>
          </>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-light text-red-800">Error loading products</h3>
                <div className="mt-2 text-sm text-red-700 font-light">{error.message}</div>
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    wishlist(product.id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <HeartIcon
                    className={`h-4 w-4 ${
                      isInWishlist(product.id)
                        ? 'text-red-500 fill-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    } transition-colors`}
                  />
                </button>

                <Link href={`/products/${product.slug}`} className="block">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-300 text-sm">Product Image</span>
                    </div>
                    {new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                      <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-light px-2 py-0.5">
                        New
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <Link href={`/products/${product.slug}`} className="block">
                      <h3 className="text-sm sm:text-base font-light text-gray-900 mb-1 hover:text-gray-600 transition line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-3 w-3 ${
                            star <= Math.floor(product.averageRating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-light ml-1">
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm font-light text-gray-900">
                      {formatCurrency(convertPrice(product.price, currency), currency)}
                    </p>
                    {product.material && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                          {product.material}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-light text-gray-900">No products found</h3>
            <p className="mt-1 text-gray-500 font-light">
              {searchQuery
                ? "We couldn't find any products matching your search."
                : "Our collection is currently empty. Please check back later."}
            </p>
            {searchQuery && (
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-light rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}