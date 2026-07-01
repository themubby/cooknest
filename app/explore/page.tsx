"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface Recipe {
  id: string;
  title: string;
  duration: string;
  category: string;
  rating: number;
  ingredients: string[];
  procedure: string[];
  createdBy: string;
  authorName?: string;
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category'); // Captures category from your grid clicks
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchPublicRecipes = async () => {
      setIsLoading(true);
      try {
        const recipeRef = collection(db, "recipe");
        
        // 🌍 PUBLIC-FIRST QUERY: Completely ignores session state
        // Fetch everything that is flagged public. If a category filter exists, apply it!
        let q = query(recipeRef, where("isPublic", "==", true));
        
        if (activeCategory) {
          // Normalizes string matching your DB structure ("Breakfast", "Lunch")
          const formattedCategory = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
          q = query(recipeRef, where("isPublic", "==", true), where("category", "==", formattedCategory));
        }

        const querySnapshot = await getDocs(q);
        const fetched: Recipe[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: doc.id,
            title: data.title || '',
            duration: data.duration || '',
            category: data.category || '',
            rating: data.rating || 5.0,
            ingredients: data.ingredients || [],
            procedure: data.procedure || [],
            createdBy: data.createdBy || 'anonymous',
            authorName: data.authorName || 'Community Chef',
          });
        });

        setRecipes(fetched);
      } catch (error) {
        console.error("Error fetching global community feeds:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicRecipes();
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Dynamic Page Headers */}
      <div className="mb-10">
        <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-1">
          Global CookNest Feed
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white capitalize">
          {activeCategory ? `${activeCategory} Discoveries` : "Browse All Community Recipes"}
        </h1>
        <p className="text-xs font-bold text-gray-400 mt-1">
          Open culinary files shared globally by kitchen masters around the world. No login required.
        </p>
      </div>

      {/* Grid Content List */}
      {isLoading ? (
        <div className="text-center py-20 font-bold text-gray-400 animate-pulse">
          Opening community cookbooks...
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8">
          <p className="text-sm font-bold text-gray-400">No public recipes found under this section yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-4xl hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {recipe.category}
                </span>
                <h3 className="font-black text-lg text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <span>⏱️ {recipe.duration}</span>
                  <span>★ {recipe.rating}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-800/50 mt-5 text-xs font-bold text-gray-400">
                <span>🧑‍🍳 {recipe.authorName || "Anonymous Chef"}</span>
                <span className="text-orange-500 font-black text-[11px] group-hover:translate-x-1 transition-transform">View Blueprint →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🌍 PUBLIC DETAILS LIGHTBOX MODAL */}
      {selectedRecipe && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedRecipe(null)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto border border-gray-100 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase">{selectedRecipe.category}</span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedRecipe.title}</h2>
                <p className="text-[11px] font-bold text-gray-400">Shared by: {selectedRecipe.authorName || "Community Chef"}</p>
              </div>
              <button 
                onClick={() => setSelectedRecipe(null)} 
                className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-6 border-y border-gray-50 dark:border-gray-800/60 py-3 text-xs font-bold text-gray-400">
              <div>Prep & Cook: <span className="text-gray-900 dark:text-white ml-1">⏱️ {selectedRecipe.duration}</span></div>
              <div>Community Rating: <span className="text-orange-500 ml-1">★ {selectedRecipe.rating}</span></div>
            </div>

            {/* Ingredients Segment */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Required Ingredients</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedRecipe.ingredients.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 px-4 py-2.5 rounded-xl">
                    <span className="text-orange-500 text-xs">🔹</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step System */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Preparation Steps</h4>
              <ol className="space-y-3">
                {selectedRecipe.procedure.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100/50 dark:border-gray-800/40">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-black">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Next.js searchParams requirement wrapper
export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading Explore Panel...</div>}>
      <ExploreContent />
    </Suspense>
  );
}