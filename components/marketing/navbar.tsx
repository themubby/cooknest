'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AvatarDropdown({ user }: { user: { name: string; email: string; image?: string } }) {
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
        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-800 overflow-hidden h-9 w-9"
      >
        {user.image ? (
          <img className="h-full w-full object-cover" src={user.image} alt="User profile" />
        ) : (
          <div className="h-full w-full bg-orange-500 text-white flex items-center justify-center font-bold">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <Link href="/profile" className="block px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Edit Profile
          </Link>
          <Link href="/my-cookbook" className="block px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            My Recipes
          </Link>
          <button onClick={() => {/* Handle Sign Out */}} className="w-full text-left block px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}