/* eslint-disable @next/next/no-html-link-for-pages */
import { Home, Menu, PlusIcon, User, X } from "lucide-react";
import { useState } from "react";

export default function Slider() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-screen bg-gray-800 text-white p-4 flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-3 right-4 text-white bg-gray-700 rounded-full p-1 hover:bg-gray-600"
        title={isOpen ? "Collapse" : "Expand"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="mt-8">
        {isOpen && (
          <h2 className="text-2xl font-bold mb-6 tracking-wide">Dashboard</h2>
        )}

        <nav className="space-y-1">
          <a
            href="/dashboard/profile"
            className={`flex items-center gap-3 p-3 rounded hover:bg-gray-700 ${
              isOpen ? "" : "justify-center"
            }`}
            title="Profile"
          >
            <User className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span>Profile</span>}
          </a>
          <a
            href="/"
            className={`flex items-center gap-3 p-3 rounded hover:bg-gray-700 ${
              isOpen ? "" : "justify-center"
            }`}
            title="Home"
          >
            <Home className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span>Home</span>}
          </a>
          <a
            href="/auth/addproduct"
            className={`flex items-center gap-3 p-3 rounded hover:bg-gray-700 ${
              isOpen ? "" : "justify-center"
            }`}
            title="Add Product"
          >
            <PlusIcon className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span>Add Product</span>}
          </a>
        </nav>
      </div>
    </aside>
  );
}
