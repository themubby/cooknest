"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
  const pathname = usePathname();

  // Unified configuration layout for our navigation entries
  const navItems = [
    { path: "/dashboard", label: "Home", icon: "🏠" },
    { path: "/dashboard/category", label: "Categories", icon: "🗂️" },
    { path: "/dashboard/recipe/add", label: "Add New Recipe", icon: "➕" },
    { path: "/dashboard/category?filter=Favorites", label: "Favorites", icon: "🧡" },
    { path: "/dashboard/profile", label: "My Profile", icon: "👤" },
  ];

  return (
    <nav className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        // Matches exactly, or handles active states including search parameters safely
        const isActive = pathname === item.path || (item.path.includes('?') && pathname + window.location.search === item.path);

        return (
          <a
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 ${
              isActive
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
            }`}
          >
            <span className="text-base shrink-0">{item.icon}</span> 
            <span className="truncate">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}