"use client";

import TopHeader from "./TopHeader";
import MiddleHeader from "./MiddleHeader";
import BottomHeader from "./BottomHeader";

interface HeaderProps {
  user?: { username: string };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="w-full z-100 top-0 left-0 right-0 bg-white shadow-md sticky">
      {/* TopHeader - might contain user info, contact details, etc. */}
      <div className="hidden md:block">
        <TopHeader user={user} />
      </div>
      
      {/* MiddleHeader - typically contains logo and main navigation */}
      <MiddleHeader />
      
      {/* BottomHeader - might contain secondary navigation or categories */}
      <div className="hidden lg:block">
        <BottomHeader />
      </div>

      {/* Mobile menu button could be added here */}
      <div className="md:hidden flex justify-between items-center p-4">
        <button className="text-gray-700">
          {/* Hamburger icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Mobile logo or other elements */}
      </div>
    </header>
  );
}