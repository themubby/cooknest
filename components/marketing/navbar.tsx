import React from 'react';
import { auth } from "@/auth";
import NavbarActions from "./navaction";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* LEFT: Clean Brand Logo */}
        <div className="flex items-center shrink-0 max-w-[40%] sm:max-w-none">
          <a href="/" className="flex items-center focus:outline-none">
            <img 
              src="/image/logo.png" 
              alt="CookNest Logo" 
              className="h-16 sm:h-24 w-auto object-contain" 
            />
          </a>
        </div>

        {/* CENTER: Marketing Links */}
        <div className="hidden md:flex items-center gap-8">
          {!session?.user ? (
            <>
              <a href="/" className="text-sm font-bold text-gray-900 hover:text-orange-500 transition-colors">Home</a>
              <a href="/recipes" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">Recipes</a>
              <a href="/categories" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">Categories</a>
              <a href="/about" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">About</a>
            </>
          ) : (
            <div className="w-4"></div>
          )}
        </div>

        {/* RIGHT: Functional Actions Wrapper Bundle */}
        <NavbarActions sessionUser={session?.user} />

      </div>
    </header>
  );
}