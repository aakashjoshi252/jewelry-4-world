// "use client";

// import Link from "next/link";
// import { useQuery } from "@apollo/client";
// import { WE_QUERY } from "../../graphql/mutations";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import f from "../../../public/person_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"


// interface HeaderProps {
//   user?: { username: string };
// }

// export default function Bheader({}: HeaderProps) {
//   const { data, loading } = useQuery(WE_QUERY);
//   const [search, setSearch] = useState("");
//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (search.trim()) {
//       router.push(`/products?query=${encodeURIComponent(search)}`);
//     }
//   };

//   return (
//     <>
//     <link
//   rel="stylesheet"
//   href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
//   integrity="sha512-vv7JDsZK1ozkDWY6nZXuMEcZAkUe7F4cyWUCv1H4UrS4sL/hZ6z8fU6rZCugGPqqkW1SxUZ3uOfScsx6Cz6LzQ=="
//   crossOrigin="anonymous"
//   referrerPolicy="no-referrer"
// />

//     <header className="flex justify-between items-center bg-white-900 text-black p-4 shadow-lg">
//       <Link href="/" className="text-2xl font-bold">
//         RKC Jewelry
//       </Link>
      
//       {/* Search Bar */}
//       <form onSubmit={handleSearch} className="flex items-center">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-3 py-1 rounded-l-md text-black bg-white"
//         />
//         <button type="submit" className="bg-blue-600 px-6 py-1 rounded-r-md hover:bg-blue-700">
//           Search
//         </button>
//       </form>
      
//       {/* Login/Signup or User Info */}
//       <div>
//   {loading ? (
//     <span>Loading...</span>
//   ) : data?.we ? (
//     <span className="text-lg">
//       <i className="fas fa-user-circle mr-2"></i>Welcome, {data.we.username}!
//     </span>
//   ) : (
//     <div className="space-x-4 flex items-center">
//       <Link href="/auth/login" className="hover:text-gray-400 flex items-center space-x-1">
//         <i className="fas fa-sign-in-alt"></i>
//         <span>Login</span>
//       </Link>
//       <Link
//         href="/auth/register"
//         className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 flex items-center space-x-2"
//       >
//         <i className="fas fa-user-plus"></i>
//         <span>Signup</span>
//       </Link>
//     </div>
//   )}
// </div>

//     </header>
//     </>
//   );
// }
