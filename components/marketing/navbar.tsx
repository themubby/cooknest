
import React from 'react';
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LEFT: Clean Brand Logo */}
        <div className="flex items-center shrink-0">
          <a href="/" className="flex items-center gap-2 focus:outline-none">
            <img src="/image/logo.png" alt="CookNest Logo" className="h-28 w-auto object-contain" />
          </a>
        </div>

        {/* CENTER: Main Marketing Links (Hidden inside the Dashboard) */}
        <div className="hidden md:flex items-center gap-8">
          {!session?.user ? (
            <>
              <a href="/" className="text-sm font-bold text-gray-900 hover:text-orange-500 transition-colors">Home</a>
              <a href="/recipes" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">Recipes</a>
              <a href="/categories" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">Categories</a>
              <a href="/about" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">About</a>
            </>
          ) : (
            /* Leaves center empty inside dashboard matching user mockup image */
            <div className="w-4"></div>
          )}
        </div>

        {/* RIGHT: Mockup Utilities Group & Auth Actions */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* 1. Search Icon Button */}
          <button className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* 2. Light/Dark Theme Toggle Icon Button */}
          <button className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          </button>

          {/* 3. Auth Split (Profile Avatar OR Dual Link Text) */}
          {session?.user ? (
            /* Logged In: Rounded Image Avatar Frame matching mockup */
            <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer ml-1">
              <img 
                src={session.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                alt="User Profile" 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            /* Logged Out: Clean text links for both routes */
            <div className="flex items-center gap-4 ml-2">
              <a 
                href="/login" 
                className="text-sm font-bold text-gray-700 hover:text-orange-500 transition-colors"
              >
                Login
              </a>
              <a 
                href="/signup" 
                className="text-sm font-bold text-gray-700 hover:text-orange-500 transition-colors"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}