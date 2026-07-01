'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react'; // 👈 Hooked up NextAuth's signOut handler

interface UserProps {
  name: string;
  email: string;
  image?: string;
}

export default function AvatarDropdown({ user }: { user: UserProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-800 overflow-hidden h-9 w-9 focus:outline-none transition-transform active:scale-95"
      >
        {user.image ? (
          <img 
            className="h-full w-full object-cover" 
            src={user.image} 
            alt="User profile" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-orange-500 text-white flex items-center justify-center font-black text-xs">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
            <p className="text-sm font-black text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs font-bold text-gray-400 truncate">{user.email}</p>
          </div>

          <Link 
            href="/profile" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            👤 Edit Profile
          </Link>
          
          <Link 
            href="/dashboard/recipes" // 👈 Matches your strict workspace route
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            🍳 My Private Workspace
          </Link>

          <button 
            onClick={() => signOut({ callbackUrl: '/' })} // 👈 Signs out safely to marketing home
            className="w-full text-left block px-3 py-2 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg mt-1 pt-2 border-t border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors"
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
}