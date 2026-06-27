// app/dashboard/layout.tsx
import React from 'react';
import Navbar from '@/components/marketing/navbar';
import SidebarNav from '@/components/dashboard/sidebar-nav'; // Our new smart dynamic links
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Main Navbar */}
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* LEFT PANEL: PERSISTENT DASHBOARD SIDEBAR */}
        <aside className="w-64 hidden md:flex flex-col bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-[calc(100vh-7.5rem)] sticky top-24 justify-between">
          
          {/* Main Workspace Navigation Options */}
          <div className="space-y-7">
            
            {/* Minimal Mini-Profile Display */}
            <div className="flex items-center gap-3 px-2">
              <img 
                src={session.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                alt="Avatar" 
                className="h-10 w-10 rounded-full object-cover border border-orange-500/20 shadow-sm"
              />
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">
                  {session.user.name || 'Chef'}
                </p>
                <span className="text-[11px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                  Master Chef
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* DYNAMIC REACTIVE SIDEBAR NAV LINK STRIP */}
            <SidebarNav />
          </div>

          {/* Sidebar Sign-Out Action */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button 
              type="submit" 
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:text-red-500 hover:bg-red-50/50 rounded-2xl cursor-pointer transition-all"
            >
              <span>🚪</span> Logout
            </button>
          </form>
        </aside>

        {/* RIGHT PANEL: DYNAMIC REPLACEMENT SPACE */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}