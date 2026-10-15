'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/theme-toggle';
import { signOut } from 'next-auth/react';
import { Menu, X, ChevronDown, Search, PlusCircle, LogOut, User, LayoutDashboard } from 'lucide-react';

interface UserProps {
  name: string;
  email: string;
  image?: string;
}

export default function Navbar({ user }: { user: UserProps | null | undefined }) {
  const [isOpen, setIsOpen] = useState(false); // Controls the profile dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Controls mobile panel
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');

  // Links that depend on whether a real user is signed in
  const favoritesHref = user ? '/dashboard/category?filter=Favorites' : '/login';
  const newRecipeHref = user ? '/dashboard/manage?new=1' : '/login';

  // Search stays inside "My Workspace" when you are there, otherwise searches public recipes
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    const base = pathname.startsWith('/dashboard/manage') ? '/dashboard/manage' : '/recipes';
    router.push(term ? `${base}?search=${encodeURIComponent(term)}` : base);
    setIsMobileMenuOpen(false);
  };

  // Close profile dropdown if user clicks anywhere outside of it
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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center gap-2 group">
              <Image
                src="/image/logo.png" 
                alt="cookNest Logo"
                width={120} // Added explicit width & height to support modern Next.js Image optimization
                height={80}
                className="h-20 w-auto object-contain transition group-hover:scale-105 dark:rounded-xl dark:bg-gray-100"
                priority
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/recipes" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition dark:text-slate-200 dark:hover:bg-slate-800">
              Explore
            </Link>
            <Link href={favoritesHref} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition dark:text-slate-200 dark:hover:bg-slate-800">
              Favorites
            </Link>
          </div>

          {/* Core Search Utility */}
          <form onSubmit={submitSearch} className="hidden sm:flex max-w-xs flex-1 items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-orange-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-orange-500"
            />
          </form>

          {/* CTA & Dynamic User Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href={newRecipeHref} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/10 hover:opacity-95 transition active:scale-95">
              <PlusCircle className="h-4 w-4" />
              New Recipe
            </Link>

            {user ? (
              /* Authenticated User Actions */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 hover:bg-slate-50 transition focus:outline-none dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Image
                    src={user.image || '/avatar-placeholder.svg'} 
                    alt={user.name || 'User Profile'}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                  />
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-100 bg-white p-2 shadow-xl transition-all duration-200 dark:border-slate-800 dark:bg-slate-950 ${
                    isOpen ? 'visible opacity-100 translate-y-1' : 'invisible opacity-0 translate-y-0'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-slate-50 dark:border-slate-900 mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/profile" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    My Profile
                  </Link>

                  <hr className="my-1 border-slate-100 dark:border-slate-900" />

                  {/* FIXED: Proper Sign Out action handler with explicit styling and LogOut icon */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50/60 transition dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* Guest Entry Link */
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-orange-600 transition dark:text-slate-200">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Open/Close Button */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Context */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100 border-t border-slate-100 dark:border-slate-800' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="space-y-1 px-4 py-4 bg-white dark:bg-slate-900">

          {/* Mobile Specific Contextual Search */}
          <form onSubmit={submitSearch} className="relative mb-4 sm:hidden">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none dark:border-slate-800 dark:bg-slate-950"
            />
          </form>

          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-slate-50 rounded-xl dark:bg-slate-950">
              <Image
                src={user.image || '/avatar-placeholder.svg'}
                alt={user.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-slate-800"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Link href="/recipes" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 dark:text-slate-200 dark:hover:bg-slate-800">
            Explore
          </Link>
          <Link href={favoritesHref} onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 dark:text-slate-200 dark:hover:bg-slate-800">
            Favorites
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-800">
              Sign In
            </Link>
          )}

          <div className="pt-4">
            <Link href={newRecipeHref} onClick={() => setIsMobileMenuOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-center font-semibold text-white shadow-lg shadow-orange-500/20">
              <PlusCircle className="h-5 w-5" />
              Create Recipe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}