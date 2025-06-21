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
    <div className="hidden md:flex justify-between items-center text-sm py-1.5 px-6 bg-gray-100 text-gray-450">
      <div className="flex gap-4 mt-1 lg:gap-8 pl-4">
        <Link className="hover:text-gray-500" href="/">Home</Link>
        <Link className="hover:text-gray-500" href="/">Daily deals</Link>
        <Link className="hover:text-gray-500" href="/help">Help & Contact</Link>
        <Link className="hover:text-gray-500" href="/about">About Us</Link>
        <Link className="hover:text-gray-500" href="/auth/register">Sign in</Link>
        <Link className="hover:text-gray-500" href="/auth/sellregister">Become a seller</Link>
      </div>

      <div className="flex mt-1 items-center gap-4">
        <CurrencySelector />
        {isLoading ? (
          <span>Loading...</span>
        ) : isLoggedIn ? (
          <Link
            href={`/auth/userprofile/${[username]}`}
            className="flex items-center gap-2 px-3 py-1.5 bg-white transition text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <UserIcon className="w-5 h-5 text-black-600" />
            {username}
          </Link>
        ) : (
          <>
            <Link href="/auth/login" className="hover:text-blue-600">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}