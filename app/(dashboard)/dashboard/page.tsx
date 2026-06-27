// app/dashboard/page.tsx
import React from 'react';
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      
      {/* Greeting Banner Segment */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Chef'}! 👋
        </h1>
        <p className="text-sm text-muted font-medium">
          Here's what's happening in your kitchen today.
        </p>
      </div>

      {/* Analytics Counter Grid Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-border/40 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-muted">Recipes Added</p>
            <h4 className="text-2xl font-black text-text mt-1">12</h4>
          </div>
          <span className="text-2xl bg-orange-50 p-3 rounded-2xl">🍳</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-border/40 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-muted">Saved Recipes</p>
            <h4 className="text-2xl font-black text-text mt-1">28</h4>
          </div>
          <span className="text-2xl bg-red-50 p-3 rounded-2xl">🧡</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-border/40 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-muted">Favorites</p>
            <h4 className="text-2xl font-black text-text mt-1">8</h4>
          </div>
          <span className="text-2xl bg-yellow-50 p-3 rounded-2xl">⭐</span>
        </div>
      </div>

      {/* RECENTLY ADDED LIST BLOCK */}
      <div className="bg-white p-6 rounded-3xl border border-border/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-text text-base">Recently Added Recipes</h3>
          <a href="/dashboard/recipes" className="text-xs font-bold text-primary hover:underline">View all ›</a>
        </div>

        <div className="divide-y divide-border/40">
          {/* Static Item Component Frame 1 */}
          <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-background border border-border/40 shrink-0">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=150" alt="Recipe" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-text text-sm hover:text-primary transition-colors cursor-pointer">Spicy Shrimp Tacos</h4>
                <p className="text-xs text-muted font-medium mt-0.5">⏱️ 20 mins &nbsp;•&nbsp; 📅 May 12, 2026</p>
              </div>
            </div>
            <button className="text-muted hover:text-text p-2 rounded-xl hover:bg-background text-sm">•••</button>
          </div>

          {/* Static Item Component Frame 2 */}
          <div className="flex items-center justify-between py-3 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-background border border-border/40 shrink-0">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=150" alt="Recipe" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-text text-sm hover:text-primary transition-colors cursor-pointer">Homemade Pepperoni Pizza</h4>
                <p className="text-xs text-muted font-medium mt-0.5">⏱️ 45 mins &nbsp;•&nbsp; 📅 May 10, 2026</p>
              </div>
            </div>
            <button className="text-muted hover:text-text p-2 rounded-xl hover:bg-background text-sm">•••</button>
          </div>
        </div>
      </div>

    </div>
  );
}