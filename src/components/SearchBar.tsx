"use client";

import { useState } from "react";

interface SearchBarProps {
  onSellerSearch: (value: string) => void;
}

export default function SearchBar({ onSellerSearch }: SearchBarProps) {
  const [term, setTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSellerSearch(value); // send to parent
  };

  return (
    <div className="bg-white shadow py-6 px-4">
      <div className="flex items-center justify-between max-w-8xl mx-auto">
        <div className="text-4xl font-bold text-gray-800">Jewelry Store</div>
        <input
          type="text"
          placeholder="Search your products..."
          value={term}
          onChange={handleChange}
          className="w-full max-w-2xl ml-8 px-6 py-3 text-md border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
