import React from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { auth } from "@/auth"; //  Import your server auth
import Link from 'next/link';

async function getPublicRecipes() {
  try {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('isPublic', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    return [];
  }
}

export default async function ExplorePage() {
  const recipes = await getPublicRecipes();
  const session = await auth(); // Check if the current visitor is logged in
  const isLoggedIn = !!session;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Explore Global Recipes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Discover culinary masterpieces published by other CookNest chefs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden group">
            
            {/* Standard Teaser Details (Visible to Everyone) */}
            <div className="h-40 bg-gray-100 dark:bg-gray-950 rounded-2xl flex items-center justify-center bg-orange-50 dark:bg-orange-950/20 text-orange-500 font-bold text-2xl">
              🍳
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-orange-500">By {recipe.authorName || "Anonymous Chef"}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{recipe.title}</h3>
              <p className="text-xs text-gray-400 mt-1">⏱️ {recipe.duration}</p>
            </div>

            {/* 🔐 THE PAYWALL CONTROLLER PANEL */}
            {isLoggedIn ? (
              // If logged in: Show the full breakdown nicely
              <div className="pt-3 border-t border-gray-50 dark:border-gray-800/60 space-y-2 animate-fadeIn">
                <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Ingredients List:</span>
                <ul className="text-xs font-bold text-gray-600 dark:text-gray-300 space-y-1">
                  {recipe.ingredients?.slice(0, 3).map((ing: string, i: number) => (
                    <li key={i}>• {ing}</li>
                  ))}
                  {recipe.ingredients?.length > 3 && <li className="text-orange-500 text-[10px]">+ {recipe.ingredients.length - 3} more ingredients</li>}
                </ul>
              </div>
            ) : (
              // If guest: Blur out the details and show a Sign In CTA
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/95 to-white/20 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900/20 backdrop-blur-[3px] flex flex-col items-center justify-end p-4 text-center">
                <p className="text-xs font-black text-gray-800 dark:text-gray-200 mb-2">Unlock recipe instructions & ingredients</p>
                <Link 
                  href="/api/auth/signin" 
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black rounded-full shadow-sm transition-all"
                >
                  🔐 Join CookNest Free
                </Link>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}