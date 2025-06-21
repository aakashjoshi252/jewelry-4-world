// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @next/next/no-html-link-for-pages */
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Range } from "react-range";
// import { useCurrency } from "../providers/CurrencyContext";
// import { convertPrice } from "../lib/currencyConverter";
// import {
//   X,
//   Menu,
//   User,
//   SlidersHorizontal,
// } from "lucide-react";

// const MAX_PRICE = 100000;

// export default function Slidebar() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const initialMinPrice = searchParams.get("minPrice")
//     ? parseInt(searchParams.get("minPrice")!, 10)
//     : 0;
//   const initialMaxPrice = searchParams.get("maxPrice")
//     ? parseInt(searchParams.get("maxPrice")!, 10)
//     : MAX_PRICE;

//   const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
//   const [isOpen, setIsOpen] = useState(true);

//   const { currency } = useCurrency();

//   useEffect(() => {
//     const params = new URLSearchParams();
//     params.set("minPrice", priceRange[0].toString());
//     params.set("maxPrice", priceRange[1].toString());
//     router.push(`?${params.toString()}`);
//   }, [priceRange, router]);

//   return (
//     <aside
//       className={`${
//         isOpen ? "w-64" : "w-16"
//       } h-screen bg-gray-800 text-white p-4 flex flex-col transition-all duration-300 ease-in-out relative`}
//     >

//       {/* Toggle Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="absolute top-3 right-4 text-white bg-gray-700 rounded-full p-1 hover:bg-gray-600"
//         title={isOpen ? "Collapse" : "Expand"}
//       >
//         {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//       </button>

//       <nav className="mt-8 space-y-4">
//         {/* Profile Link */}
//         <a
//             href="/auth/userprofile"
//             className={`flex items-center gap-3 p-3 rounded hover:bg-gray-700 ${
//                 isOpen ? "" : "justify-center"
//             }`}
//             title="Profile"
//             >
//             <User className="w-6 h-6 flex-shrink-0" /> {/* 👈 this is the magic combo */}
//             {isOpen && <span>Profile</span>}
//         </a>


//         {/* Price Filter Section */}
//         <div>
//           <div
//             className={`flex items-center gap-2 p-3 text-white font-semibold ${
//               !isOpen ? "justify-center" : ""
//             }`}
//             title="Filter by Price"
//           >
//             <SlidersHorizontal className="h-5 w-5 flex-shrink-0" />
//             {isOpen && <span>Filter by Price</span>}
//           </div>

//           {isOpen && (
//             <div className="mt-2 px-2">
//               <Range
//                 step={100}
//                 min={0}
//                 max={MAX_PRICE}
//                 values={priceRange}
//                 onChange={(values) => setPriceRange(values)}
//                 renderTrack={({ props, children }) => (
//                   <div {...props} className="h-2 bg-gray-400 rounded-full relative">
//                     {children}
//                   </div>
//                 )}
//                 renderThumb={({ props, index }) => {
//                   const { key, ...restProps } = props;
//                   return (
//                     <div
//                       key={index}
//                       {...restProps}
//                       className="w-5 h-5 bg-blue-500 rounded-full cursor-pointer"
//                     />
//                   );
//                 }}
//               />
//               <div className="mt-2 text-center text-sm">
//                 {currency} {convertPrice(priceRange[0], currency).toFixed(2)} - {currency}{" "}
//                 {convertPrice(priceRange[1], currency).toFixed(2)}
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>
//     </aside>
//   );
// }