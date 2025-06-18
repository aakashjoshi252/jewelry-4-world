"use client";

import Link from "next/link";
import { ME_QUERY, WE_QUERY } from "../graphql/mutations";
import { useQuery } from "@apollo/client";
import { UserIcon } from "@heroicons/react/24/outline";
import CurrencySelector from "../components/CurrencySelector";

export default function TopHeader() {
  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const { data: weData, loading: weLoading } = useQuery(WE_QUERY);

  const isLoading = meLoading || weLoading;
  const username = meData?.me?.username || weData?.we?.username;
  const isLoggedIn = !!username;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center text-sm py-1.5 px-4 md:px-6 bg-gray-100 text-gray-450">
      {/* Left Links - Hidden on mobile, shown on medium screens and up */}
      <div className="hidden md:flex gap-4 lg:gap-8 md:pl-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/" className="hover:text-blue-600">Daily deals</Link>
        <Link href="/help" className="hover:text-blue-600">Help & Contact</Link>
        <Link href="/about" className="hover:text-blue-600">About Us</Link>
      </div>

      {/* Mobile Menu Button - Shown only on mobile */}
      <div className="md:hidden w-full flex justify-between items-center py-2">
        <button className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <CurrencySelector mobile />
      </div>

      {/* Right Side - Adjusted for mobile */}
      <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-normal">
        {/* Mobile-only links */}
        <div className="md:hidden flex items-center">
          {isLoading ? (
            <span className="text-sm">Loading...</span>
          ) : isLoggedIn ? (
            <Link
              href="/auth/userprofile"
              className="flex items-center gap-1 px-2 py-1 bg-white rounded text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <UserIcon className="w-4 h-4 text-black-600" />
              <span className="truncate max-w-[80px]">{username}</span>
            </Link>
          ) : (
            <Link href="/auth/login" className="text-sm hover:text-blue-600 px-2">
              Login
            </Link>
          )}
        </div>

        {/* Desktop links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/register" className="hover:text-blue-600">Sign in</Link>
          <Link href="/auth/sellregister" className="hover:text-blue-600">Become a seller</Link>
          <CurrencySelector />
          {isLoading ? (
            <span>Loading...</span>
          ) : isLoggedIn ? (
            <Link
              href="/auth/userprofile"
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <UserIcon className="w-5 h-5 text-black-600" />
              {username}
            </Link>
          ) : (
            <Link href="/auth/login" className="hover:text-blue-600">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}