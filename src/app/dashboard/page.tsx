/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { useState } from "react";
import { SELLER_PRODUCT_PAGINATION } from "../../graphql/queries";
import Slider from "../../components/sliderforSeller";
import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar";

export default function Dashboard() {
  const [offset, setOffset] = useState(0);
  const limit = 2;

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sortDate, setSortDate] = useState<"asc" | "desc" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { data, loading } = useQuery(SELLER_PRODUCT_PAGINATION, {
    variables: { limit, offset },
    fetchPolicy: "cache-and-network",
  });

  const paginatedData = data?.paginatedMyProducts;
  const products = paginatedData?.products || [];
  const totalCount = paginatedData?.total || 0;

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    console.log("Deleting selected products:", selectedProducts);
    setSelectedProducts([]);
  };

  // Sort logic
  if (sortOrder) {
    filteredProducts.sort((a: any, b: any) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
  } else if (sortDate) {
    filteredProducts.sort((a: any, b: any) =>
      sortDate === "asc"
        ? Number(a.createdAt) - Number(b.createdAt)
        : Number(b.createdAt) - Number(a.createdAt)
    );
  }

  const togglePriceSort = () => {
    setSortOrder((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setSortDate(null);
  };

  const toggleDateSort = () => {
    setSortDate((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setSortOrder(null);
  };

  const renderSortIcon = (field: "price" | "date") => {
    const direction = field === "price" ? sortOrder : sortDate;
    if (direction === "asc") return "↑";
    if (direction === "desc") return "↓";
    return "⇅";
  };

  const allSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product: any) => selectedProducts.includes(product.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts([]);
    } else {
      const allIds = filteredProducts.map((product: any) => product.id);
      setSelectedProducts(allIds);
    }
  };

  return (
    <>
      <TopHeader />
      <SearchBar onSellerSearch={setSearchTerm} />
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="flex flex-1 overflow-hidden">
          <Slider />
          <main className="flex-1 p-6 bg-white overflow-x-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Products
            </h1>

            {selectedProducts.length > 0 && (
              <button
                className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                onClick={handleBulkDelete}
              >
                Delete Selected Products
              </button>
            )}

            {filteredProducts.length > 0 ? (
              <div className="overflow-auto max-h-[70vh]">
                <table className="min-w-full bg-white shadow-md rounded-xl border border-gray-200">
                  <thead className="bg-gray-100 text-gray-600 font-semibold sticky top-0 z-10 text-sm text-left">
                    <tr>
                      <th className="p-3">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-3">Sr No</th>
                      <th className="p-3">Image</th>
                      <th className="p-3">Name</th>
                      <th className="p-3 cursor-pointer" onClick={toggleDateSort}>
                        Created At <span className="ml-1">{renderSortIcon("date")}</span>
                      </th>
                      <th className="p-3 cursor-pointer" onClick={togglePriceSort}>
                        Price ($) <span className="ml-1">{renderSortIcon("price")}</span>
                      </th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {filteredProducts.map((product: any, idx: number) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleCheckboxChange(product.id)}
                          />
                        </td>
                        <td className="p-3">{offset + idx + 1}</td>
                        <td className="p-3">
                          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md text-xs text-gray-400">
                            Image
                          </div>
                        </td>
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3">
                          {new Date(Number(product.createdAt)).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-semibold">${product.price}</td>
                        <td className="p-3">{product.category?.name || "-"}</td>
                        <td className="p-3">
                          <button className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-blue-600 text-xs transition">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No products found.</p>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(offset - limit, 0))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600 text-sm">
                Showing {offset + 1} - {Math.min(offset + limit, totalCount)} of {totalCount}
              </span>
              <button
                disabled={offset + limit >= totalCount}
                onClick={() => setOffset(offset + limit)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
