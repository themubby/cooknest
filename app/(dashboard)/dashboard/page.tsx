import React from "react";
import { auth } from "@/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { getChefProfile } from "@/lib/profile";

interface RecentRecipe {
  id: string;
  title: string;
  duration: string;
  category: string;
  createdAtMs: number;
}

export default async function DashboardPage() {
  const session = await auth();
  const userEmail = session?.user?.email;
  const profile = await getChefProfile(userEmail, session?.user ?? {});

  let totalRecipesCount = 0;
  let favoritesCount = 0;
  let categoriesUsed = 0;
  let recentRecipes: RecentRecipe[] = [];
  let loadError: string | null = null;

  if (userEmail) {
    try {
      // Only equality filters, so no composite Firestore index is needed; sorting happens here.
      const [recipeSnapshot, favoriteSnapshot] = await Promise.all([
        getDocs(query(collection(db, "recipe"), where("createdBy", "==", userEmail))),
        getDocs(query(collection(db, "favorites"), where("userEmail", "==", userEmail))),
      ]);

      const recipes: RecentRecipe[] = recipeSnapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt;
        return {
          id: d.id,
          title: data.title || "Untitled recipe",
          duration: data.duration || "",
          category: data.category || "Uncategorised",
          createdAtMs: typeof createdAt?.toMillis === "function" ? createdAt.toMillis() : 0,
        };
      });

      totalRecipesCount = recipes.length;
      favoritesCount = favoriteSnapshot.size;
      categoriesUsed = new Set(recipes.map((r) => r.category)).size;
      recentRecipes = recipes.sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 5);
    } catch (error) {
      console.error("Dashboard query failed:", error);
      loadError = error instanceof Error ? error.message : String(error);
    }
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-mono dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          <strong>Could not load your kitchen data:</strong> {loadError}
        </div>
      )}

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          Welcome back, {profile.name.split(" ")[0] || "Chef"}! 👋
        </h1>
        <p className="text-sm text-gray-500 font-medium dark:text-gray-400">Here&apos;s what&apos;s happening in your kitchen today.</p>
      </div>

      {/* Counters (all read from Firestore) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between dark:bg-gray-900 dark:border-gray-800">
          <div>
            <p className="text-sm font-bold text-gray-400">Recipes Added</p>
            <h4 className="text-2xl font-black text-gray-900 mt-1 dark:text-white">{totalRecipesCount}</h4>
          </div>
          <span className="text-2xl bg-orange-50 p-3 rounded-2xl dark:bg-orange-950/30">🍳</span>
        </div>

        <a
          href="/dashboard/category?filter=Favorites"
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800"
        >
          <div>
            <p className="text-sm font-bold text-gray-400">Favorites</p>
            <h4 className="text-2xl font-black text-gray-900 mt-1 dark:text-white">{favoritesCount}</h4>
          </div>
          <span className="text-2xl bg-red-50 p-3 rounded-2xl dark:bg-red-950/30">🧡</span>
        </a>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between dark:bg-gray-900 dark:border-gray-800">
          <div>
            <p className="text-sm font-bold text-gray-400">Categories Used</p>
            <h4 className="text-2xl font-black text-gray-900 mt-1 dark:text-white">{categoriesUsed}</h4>
          </div>
          <span className="text-2xl bg-yellow-50 p-3 rounded-2xl dark:bg-yellow-950/30">🗂️</span>
        </div>
      </div>

      {/* Recently added */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-gray-900 text-base dark:text-white">Recently Added Recipes</h3>
          <a href="/dashboard/manage" className="text-xs font-bold text-orange-500 hover:underline">
            View all ›
          </a>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {recentRecipes.length === 0 ? (
            <div className="text-center py-8 text-sm font-medium text-gray-400">
              You haven&apos;t written any recipes yet. Open{" "}
              <a href="/dashboard/manage?new=1" className="text-orange-500 font-bold hover:underline">
                My Workspace
              </a>{" "}
              and add your first one!
            </div>
          ) : (
            recentRecipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center text-xl dark:bg-gray-800 dark:border-gray-800">
                    🍲
                  </div>
                  <div>
                    <a
                      href={`/recipes/${recipe.id}`}
                      className="font-bold text-gray-900 text-sm hover:text-orange-500 transition-colors dark:text-white"
                    >
                      {recipe.title}
                    </a>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      ⏱️ {recipe.duration} &nbsp;•&nbsp; 📂 {recipe.category}
                    </p>
                  </div>
                </div>
                <a
                  href={`/recipes/${recipe.id}`}
                  className="text-xs font-bold text-gray-400 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  View ›
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
