/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { useQuery } from "@apollo/client";
import { CATEGORY_BY_SLUG, GET_PRODUCTS_BY_CATEGORY } from "../../../graphql/queries";
import Link from "next/link";
import { HeartIcon, StarIcon } from "lucide-react";
import { formatCurrency } from "../../../lib/formatCurrency"; // Ensure these exist or replace accordingly
import { convertPrice } from "../../../lib/currencyConverter";
import { useCurrency } from "../../../providers/CurrencyContext";
import { useQuery } from "@apollo/client";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const  { currency } = useCurrency(); // Replace with your dynamic currency logic

  // Fetch category data
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(
    CATEGORY_BY_SLUG,
    {
      variables: { slug: params.slug },
      onCompleted: (data: any) => console.log("Category query completed:", data),
      onError: (error: any) => console.error("Category query error:", error),
    }
  );

  // Fetch products data
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(
    GET_PRODUCTS_BY_CATEGORY,
    {
      variables: { name: categoryData?.categoryBySlug?.name },
      skip: !categoryData?.categoryBySlug?.name,
    }
  );

  if (categoryLoading) return <div>Loading category...</div>;
  if (categoryError) return <div>Error loading category</div>;

  const category = categoryData?.categoryBySlug;
  if (!category) return <div>Category not found</div>;

  if (productsLoading) return <div>Loading products...</div>;
  if (productsError) return <div>Error loading products</div>;

  const products = productsData?.productsByCategory || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

      {category.subcategories?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.subcategories.map((subcategory: any) => (
              <div key={subcategory.id} className="border p-4 rounded-lg">
                <Link
                  href={`/category/${subcategory.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {subcategory.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product: any) => (
            <div
            key={product.id}
            className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <Link href={`/products/${product.slug}`} className="block">
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Product Image</span>
                </div>
                {new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                  <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-light px-2 py-0.5">
                    New
                  </span>
                )}
              </div>
            </Link>

            <button
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition"
              aria-label="Add to wishlist"
            >
              <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
            </button>
          
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
                      className={`h-4 w-4 ${
                        star <= Math.floor(product.averageRating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  {product.averageRating?.toFixed(1) || "0.0"} ({product.reviewCount || 0})
                </span>
              </div>
          
              {/* <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p> */}
          
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-light text-gray-900">
                    {formatCurrency(convertPrice(product.price, currency), currency)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.material}
                </span>
              </div>
          
              {/* <button
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              >
                Add to Cart
              </button> */}
            </div>
          </div>
          
          ))}
        </div>
      ) : (
        <div>No products found.</div>
      )}
    </div>
  );
}
