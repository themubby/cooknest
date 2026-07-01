
import React from 'react';
import { auth } from "@/auth";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/config/firebase";

export default async function DashboardPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  let totalRecipesCount = 0;
  let recentRecipes: any[] = [];
  let debugErrorMessage: string | null = null; // <-- Tracker for server query failure

  if (userEmail) {
    try {
      const recipeRef = collection(db, "recipe");

      // 1. Fetch total count
      const countQuery = query(recipeRef, where("createdBy", "==", userEmail));
      const countSnapshot = await getDocs(countQuery);
      totalRecipesCount = countSnapshot.size;

      // 2. Fetch recent entries
      const recentQuery = query(
        recipeRef,
        where("createdBy", "==", userEmail),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentSnapshot = await getDocs(recentQuery);
      
      recentRecipes = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error: any) {
      console.error("Server terminal error catch:", error);
      debugErrorMessage = error.message || String(error); // <-- Capture the hidden error
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Visual Debug Banner — Shows up only if a database error happens */}
      {debugErrorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-mono">
          <strong>Database Query Blocked:</strong> {debugErrorMessage}
          <p className="mt-2 text-[11px] text-gray-500">
            💡 If this message mentions a missing index, it will provide a link to click and auto-create it.
          </p>
        </div>
      )}

      {/* Greeting Banner Segment */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Chef'}! 👋
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Here's what's happening in your kitchen today.
        </p>
      </div>

      {/* Analytics Counter Grid Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Dynamic Counter Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400">Recipes Added</p>
            <h4 className="text-2xl font-black text-gray-900 mt-1">
              {totalRecipesCount} {/* <-- REAL-TIME VALUE FROM FIRESTORE */}
            </h4>
          </div>
          <span className="text-2xl bg-orange-50 p-3 rounded-2xl">🍳</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400">Saved Recipes</p>
            <h4 className="text-2xl font-black text-gray-900 mt-1">0</h4>
          </div>
          <span className="text-2xl bg-red-50 p-3 rounded-2xl">🧡</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400">Favorites</p>
            <h4 className="text-2xl font-black text-gray-900 mt-1">0</h4>
          </div>
          <span className="text-2xl bg-yellow-50 p-3 rounded-2xl">⭐</span>
        </div>
      </div>

      {/* RECENTLY ADDED LIST BLOCK */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-gray-900 text-base">Recently Added Recipes</h3>
          <a href="/dashboard/recipe" className="text-xs font-bold text-orange-500 hover:underline">View all ›</a>
        </div>

        <div className="divide-y divide-gray-100">
          {recentRecipes.length === 0 ? (
            /* Empty State State Framework */
            <div className="text-center py-8 text-sm font-medium text-gray-400">
              You haven't written any recipes yet. Click "Add New Recipe" to populate your space!
            </div>
          ) : (
            /* Loop and Render Real User Input Array Content Map */
            recentRecipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center text-xl">
                    🍲
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm hover:text-orange-500 transition-colors cursor-pointer">
                      {recipe.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      ⏱️ {recipe.duration} &nbsp;•&nbsp; 📂 {recipe.category}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-50 text-sm">•••</button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}