"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface NavbarActionsProps {
  sessionUser: any;
}

export default function NavbarActions({ sessionUser }: NavbarActionsProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Prevent light flickering by waiting until client assembly completes
  useEffect(() => {
    setMounted(true);
    setSearchVal(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchVal.trim()) {
      params.set("search", searchVal.trim());
    } else {
      params.delete("search");
    }

    // Pushes query string dynamically to filter lists safely across any child dashboard page
    router.push(`${pathname}?${params.toString()}`);
  };

  if (!mounted) {
    return <div className="w-30 h-9 bg-gray-100/50 dark:bg-gray-800/40 animate-pulse rounded-full" />;
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
      
      {/* 🔍 SLIDEOUT RESPONSIVE SEARCH INPUT BAR */}
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        {showSearchInput && (
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="px-3 py-1.5 mr-1 text-xs border border-gray-100 dark:border-gray-800 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none w-32 sm:w-44 transition-all duration-200"
          />
        )}
        <button
          type="button"
          onClick={() => {
            if (showSearchInput && searchVal) {
              // Trigger search filter if something is typed
              const params = new URLSearchParams(searchParams.toString());
              params.set("search", searchVal.trim());
              router.push(`${pathname}?${params.toString()}`);
            } else {
              setShowSearchInput(!showSearchInput);
            }
          }}
          className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer ${
            showSearchInput ? "text-orange-500 bg-orange-50 dark:bg-orange-950/30" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* 🌗 THEME SWITCHER TOGGLE */}
      <button 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-full transition-colors cursor-pointer"
        aria-label="Toggle Theme Mode"
      >
        {theme === "dark" ? (
          // Moon icon for dark mode state
          <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          // Sun icon for light mode state
          <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        )}
      </button>

      {/* 👤 AUTH AVATAR PORT / LINK CONNECTIONS */}
      {sessionUser ? (
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer ml-0.5 shrink-0">
          <img 
            src={sessionUser.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
            alt="User Profile" 
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-4 ml-1">
          <a href="/login" className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Login</a>
          <a href="/signup" className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Sign Up</a>
        </div>
      )}
    </div>
  );
}