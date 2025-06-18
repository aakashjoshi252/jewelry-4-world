// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useSearchParams } from "next/navigation";
// import { useQuery } from "@apollo/client";
// import { GET_PAGINATION, FILTERED_PRODUCTS_QUERY } from "../../graphql/queries";
// import { useCurrency } from "../../providers/CurrencyContext";
// import { convertPrice } from "../../lib/currencyConverter";
// import { formatCurrency } from "../../lib/formatCurrency";
// import Link from "next/link";
// import { StarIcon } from "@heroicons/react/24/solid";
// import { HeartIcon } from "@heroicons/react/24/outline";
// import { useState, useEffect, useRef } from "react";
// import TopRatedProducts from "./topratedprod";

// export default function ProductsPage() {
//   const searchParams = useSearchParams();
//   const { currency } = useCurrency();
//   const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

//   // Filters from URL search params
//   const searchQuery = searchParams.get("query");
//   const minPrice = searchParams.get("minPrice");
//   const maxPrice = searchParams.get("maxPrice");
//   const material = searchParams.get("material");
//   const category = searchParams.get("category");

//   const isFiltering = Boolean(searchQuery || minPrice || maxPrice || material || category);

//   // Pagination states for filtered
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [filteredCursor, setFilteredCursor] = useState<string | null>(null);
//   const [filteredHasMore, setFilteredHasMore] = useState(true);
//   const [loadingMoreFiltered, setLoadingMoreFiltered] = useState(false);

//   // Pagination states for main
//   const [mainProducts, setMainProducts] = useState<any[]>([]);
//   const [mainCursor, setMainCursor] = useState<string | null>(null);
//   const [mainHasMore, setMainHasMore] = useState(true);
//   const [loadingMoreMain, setLoadingMoreMain] = useState(false);

//   const observerRef = useRef<HTMLDivElement | null>(null);

//   // Queries for filtered products
//   const {
//     loading: loadingFiltered,
//     error: errorFiltered,
//     fetchMore: fetchMoreFiltered,
//   } = useQuery(FILTERED_PRODUCTS_QUERY, {
//     variables: {
//       limit: 12,
//       cursor: null,
//       search: searchQuery || undefined,
//       minPrice: minPrice ? parseFloat(minPrice) : undefined,
//       maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
//       material: material || undefined,
//       category: category || undefined,
//     },
//     skip: !isFiltering,
//     notifyOnNetworkStatusChange: true,
//     onCompleted: (data) => {
//       setFilteredProducts(data.paginatedFilteredProducts.products);
//       setFilteredCursor(data.paginatedFilteredProducts.nextCursor);
//       setFilteredHasMore(data.paginatedFilteredProducts.hasMore);
//     },
//   });

//   // Queries for main products
//   const {
//     loading: loadingMain,
//     error: errorMain,
//     fetchMore: fetchMoreMain,
//   } = useQuery(GET_PAGINATION, {
//     variables: { limit: 12, cursor: null },
//     skip: isFiltering,
//     notifyOnNetworkStatusChange: true,
//     onCompleted: (data) => {
//       setMainProducts(data.paginatedProducts.products);
//       setMainCursor(data.paginatedProducts.nextCursor);
//       setMainHasMore(data.paginatedProducts.hasMore);
//     },
//   });

//   // Intersection Observer to trigger fetching more
//   useEffect(() => {
//     if (!observerRef.current) return;

//     const observer = new IntersectionObserver(
//       async ([entry]) => {
//         if (!entry.isIntersecting) return;

//         if (isFiltering) {
//           if (loadingFiltered || loadingMoreFiltered || !filteredHasMore || !filteredCursor) return;

//           setLoadingMoreFiltered(true);
//           try {
//             const { data: moreData } = await fetchMoreFiltered({
//               variables: {
//                 limit: 12,
//                 cursor: filteredCursor,
//                 search: searchQuery || undefined,
//                 minPrice: minPrice ? parseFloat(minPrice) : undefined,
//                 maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
//                 material: material || undefined,
//                 category: category || undefined,
//               },
//             });
//             setFilteredProducts((prev) => [
//               ...prev,
//               ...moreData.paginatedFilteredProducts.products,
//             ]);
//             setFilteredCursor(moreData.paginatedFilteredProducts.nextCursor);
//             setFilteredHasMore(moreData.paginatedFilteredProducts.hasMore);
//           } finally {
//             setLoadingMoreFiltered(false);
//           }
//         } else {
//           if (loadingMain || loadingMoreMain || !mainHasMore || !mainCursor) return;

//           setLoadingMoreMain(true);
//           try {
//             const { data: moreData } = await fetchMoreMain({
//               variables: { limit: 12, cursor: mainCursor },
//             });
//             setMainProducts((prev) => [...prev, ...moreData.paginatedProducts.products]);
//             setMainCursor(moreData.paginatedProducts.nextCursor);
//             setMainHasMore(moreData.paginatedProducts.hasMore);
//           } finally {
//             setLoadingMoreMain(false);
//           }
//         }
//       },
//       { rootMargin: "200px" }
//     );

//     observer.observe(observerRef.current);
//     return () => observer.disconnect();
//   }, [
//     isFiltering,
//     loadingFiltered,
//     loadingMoreFiltered,
//     filteredCursor,
//     filteredHasMore,
//     fetchMoreFiltered,
//     loadingMain,
//     loadingMoreMain,
//     mainCursor,
//     mainHasMore,
//     fetchMoreMain,
//     searchQuery,
//     minPrice,
//     maxPrice,
//     material,
//     category,
//   ]);

//   // Reset state on filter changes
//   useEffect(() => {
//     if (isFiltering) {
//       setFilteredProducts([]);
//       setFilteredCursor(null);
//       setFilteredHasMore(true);
//     } else {
//       setMainProducts([]);
//       setMainCursor(null);
//       setMainHasMore(true);
//     }
//   }, [searchQuery, minPrice, maxPrice, material, category, isFiltering]);

//   const displayProducts = isFiltering ? filteredProducts : mainProducts;
//   const isLoading = isFiltering ? loadingFiltered : loadingMain;
//   const loadMoreLoading = isFiltering ? loadingMoreFiltered : loadingMoreMain;
//   const noMoreProducts = isFiltering ? !filteredHasMore : !mainHasMore;
//   const error = isFiltering ? errorFiltered : errorMain;

//   return (
//     <div className="bg-gray-50">
//       <main className="px-4 sm:px-6 pb-12 max-w-7xl mx-auto">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2 pt-5">
//             {searchQuery ? `Search Results for "${searchQuery}"` : "Our Collection"}
//           </h1>
//           <p className="text-gray-600">
//             {searchQuery ? "" : "Discover our premium selection of products"}
//           </p>
//         </div>

//         {!isFiltering && (
//           <>
//             <TopRatedProducts />
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-800 mb-4">Our recently added</h1>
//             </div>
//           </>
//         )}

//         {isLoading && displayProducts.length === 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
//               >
//                 <div className="h-60 bg-gray-200"></div>
//                 <div className="p-4 space-y-3">
//                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg
//                   className="h-5 w-5 text-red-500"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
//                 <div className="mt-2 text-sm text-red-700">{error.message}</div>
//               </div>
//             </div>
//           </div>
//         ) : displayProducts.length > 0 ? (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {displayProducts.map((product: any) => (
//                 <div
//                   key={product.id}
//                   className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
//                   onMouseEnter={() => setHoveredProduct(product.id)}
//                   onMouseLeave={() => setHoveredProduct(null)}
//                 >
//                   <button
//                     className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md transition-all ${
//                       hoveredProduct === product.id
//                         ? "opacity-100"
//                         : "opacity-0 group-hover:opacity-100"
//                     }`}
//                     aria-label="Add to wishlist"
//                   >
//                     <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
//                   </button>

//                   <Link href={`/products/${product.slug}`} className="block">
//                     <div className="aspect-square bg-gray-100 relative overflow-hidden">
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <span className="text-gray-400 text-sm">Product Image</span>
//                       </div>
//                       {new Date(product.createdAt) >
//                         new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
//                         <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
//                           New
//                         </span>
//                       )}
//                     </div>
//                   </Link>

//                   <div className="p-4">
//                     <div className="flex justify-between items-start">
//                       <Link href={`/products/${product.slug}`} className="block">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition">
//                           {product.name}
//                         </h3>
//                       </Link>
//                     </div>

//                     <div className="flex items-center mb-2">
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <StarIcon
//                             key={star}
//                             className={`h-4 w-4 ${
//                               star <= Math.floor(product.averageRating || 0)
//                                 ? "text-yellow-400"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-xs text-gray-500 ml-1">
//                         {product.averageRating?.toFixed(1) || "0.0"} (
//                         {product.reviewCount || 0})
//                       </span>
//                     </div>

//                     <p className="text-sm text-gray-600 line-clamp-2 mb-3">
//                       {product.description}
//                     </p>

//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-lg font-bold text-gray-900">
//                           {formatCurrency(
//                             convertPrice(product.price, currency),
//                             currency
//                           )}
//                         </p>
//                         {currency !== "USD" && (
//                           <p className="text-xs text-gray-500">
//                             {formatCurrency(product.price, "USD")}
//                           </p>
//                         )}
//                       </div>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {product.material}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div ref={observerRef} className="mt-8 text-center">
//               {loadMoreLoading && (
//                 <p className="text-gray-500 text-sm animate-pulse">Loading more products...</p>
//               )}
//               {noMoreProducts && (
//                 <p className="text-gray-400 text-sm">No more products to load</p>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-12">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
//             <p className="mt-1 text-gray-500">
//               {searchQuery
//                 ? "We couldn't find any products matching your search."
//                 : "Our collection is currently empty. Please check back later."}
//             </p>
//             {searchQuery && (
//               <div className="mt-6">
//                 <Link
//                   href="/products"
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
//                 >
//                   View All Products
//                 </Link>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
