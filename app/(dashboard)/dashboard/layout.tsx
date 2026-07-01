// app/dashboard/layout.tsx
import React from 'react';
import Navbar from '@/components/marketing/navbar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Providers } from "@/components/provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
        {/* Top Main Navbar */}
        <Navbar />

        {/* Updated parent wrapper to handle padding correctly on mobile vs desktop */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 pb-28 md:pb-6">

          {/* 🖥️ DESKTOP LEFT PANEL: PERSISTENT DASHBOARD SIDEBAR (Unchanged structure) */}
          <aside className="w-64 hidden md:flex flex-col bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-[calc(100vh-7.5rem)] sticky top-24 justify-between">

            <div className="space-y-7">
              {/* Minimal Mini-Profile Display */}
              <div className="flex items-center gap-3 px-2">
                <img
                  src={session.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full object-cover border border-orange-500/20 shadow-sm"
                />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-35">
                    {session.user.name || 'Chef'}
                  </p>
                  <span className="text-[11px] text-orange-500 font-bold bg-orange-50 dark:bg-orange-950/30 px-1.5 py-0.5 rounded">
                    Master Chef
                  </span>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* DYNAMIC REACTIVE SIDEBAR NAV LINK STRIP */}
              <SidebarNav />
            </div>

            {/* Sidebar Sign-Out Action */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
              className="w-full pt-4 border-t border-gray-50 dark:border-gray-800/60"
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-xs font-black text-red-500 bg-red-50/40 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-100/50 dark:border-red-900/30 rounded-2xl cursor-pointer transition-all duration-200 uppercase tracking-wider group"
              >
                <span className="text-sm transition-transform duration-200 group-hover:-translate-x-0.5">🚪</span>
                Logout Account
              </button>
            </form>
          </aside>

          {/* 🚀 RIGHT PANEL: DYNAMIC REPLACEMENT SPACE */}
          <main className="flex-1 min-w-0 w-full overflow-x-hidden">
            {children}
          </main>

        </div>

        {/* 📱 MOBILE BOTTOM NAVIGATION FIXED DOCK (Visible ONLY below md tailwind breakpoint) */}
        <nav className="md:hidden fixed bottom-4 inset-x-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 px-3 py-2.5 rounded-4xl flex justify-around items-center z-40 shadow-lg shadow-gray-200/50 dark:shadow-none">
          <SidebarNav isMobileHorizontal={true} />
        </nav>

      </div>
    </Providers>
  );
}