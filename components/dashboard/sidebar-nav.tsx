"use client";

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface SidebarNavProps {
  isMobileHorizontal?: boolean;
}

export default function SidebarNav({ isMobileHorizontal = false }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const fullCurrentPath = pathname + currentSearch;

  const navItems = [
    { path: "/dashboard", label: "Home", icon: "🏠" },
    { path: "/dashboard/category", label: "Categories", icon: "🗂️" },
    { path: "/dashboard/manage", label: "Manage", icon: "🍳" },
    { path: "/dashboard/category?filter=Favorites", label: "Favorites", icon: "🧡" },
    { path: "/dashboard/profile", label: "Profile", icon: "👤" },
  ];

  const containerClasses = isMobileHorizontal
    ? "flex flex-row justify-around w-full gap-1 px-2"
    : "flex flex-col gap-1.5";

  return (
    <nav className={containerClasses}>
      {navItems.map((item) => {
        const isActive = pathname === item.path || fullCurrentPath === item.path;

        return (
          <a
            key={item.path}
            href={item.path}
            className={`flex items-center transition-all duration-200 ${
              isMobileHorizontal
                ? `flex-col gap-0.5 justify-center flex-1 py-1 rounded-xl text-[10px] font-bold ${
                    isActive 
                      ? "text-orange-500 font-black scale-105" 
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`
                : `gap-3 px-4 py-3 text-sm font-bold rounded-2xl ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
                  }`
            }`}
          >
            {/* Make icons larger on mobile layout for clear legibility */}
            <span className={`${isMobileHorizontal ? "text-xl" : "text-base shrink-0"}`}>{item.icon}</span>
            
            {/* 🔥 FIXED: Hidden text on tiny viewports (hidden sm:block) so text never crowds or drops offline */}
            <span className={isMobileHorizontal ? "hidden sm:block text-center truncate w-full" : "truncate"}>
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}