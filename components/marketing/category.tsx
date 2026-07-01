'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Category Definitions mapping matching your workspace cases exactly
const CATEGORIES_DATA = [
  { id: 1, name: 'Breakfast', query: 'Breakfast', icon: '🍳', bgClass: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600' },
  { id: 2, name: 'Lunch & Mains', query: 'Lunch', icon: '🍲', bgClass: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600' },
  { id: 3, name: 'Dinner', query: 'Dinner', icon: '🍽️', bgClass: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600' },
  { id: 4, name: 'Desserts', query: 'Desserts', icon: '🍰', bgClass: 'bg-lime-500/10 hover:bg-lime-500/20 text-lime-600' },
];

interface Recipe {
  id: string;
  title: string;
  duration: string;
  category: string;
  rating: number;
  ingredients: string[];
  procedure: string[];
  authorName?: string;
}

function PublicRecipesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get('category'); // Tracks selected category via URL query
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Fetch Public Recipes from Firestore
  useEffect(() => {
    const fetchPublicData = async () => {
      setIsLoading(true);
      try {
        const recipeRef = collection(db, "recipe");
        
        // 🔐 UNIVERSAL PUBLIC FILTER: Only pull recipes marked isPublic: true
        let q = query(recipeRef, where("isPublic", "==", true));
        
        // Apply category filter dynamically if clicked
        if (activeCategory) {
          q = query(recipeRef, where("isPublic", "==", true), where("category", "==", activeCategory));
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
            authorName: data.authorName || 'Community Chef',
          });
        });

        setRecipes(fetched);
      } catch (error) {
        console.error("Error loading community recipe pool:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicData();
  }, [activeCategory]);

  const handleCategoryClick = (categoryQuery: string) => {
    if (activeCategory === categoryQuery) {
      router.push('/recipes'); // Clear filter if clicking active category again
    } else {
      router.push(`/recipes?category=${categoryQuery}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. CATEGORIES FILTER PANEL */}
      <div>
        <div className="mb-6">
          <span className="text-xs font-black tracking-widest text-orange-500 uppercase block mb-1">
            Inspiration Focus
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Popular Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES_DATA.map((category) => {
            const isSelected = activeCategory === category.query;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.query)}
                className={`flex flex-col items-center justify-center text-center p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-900 ${
                  isSelected 
                    ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/10' 
                    : 'border-gray-100 dark:border-gray-800'
                } ${category.bgClass}`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">{category.name}</h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC COMMUNITY DIARY FEED */}
      <div>
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Public Diary Feed</h2>
            <p className="text-xs font-bold text-gray-400 mt-0.5">Shared kitchen logs viewable by anyone.</p>
          </div>
          {activeCategory && (
            <button 
              onClick={() => router.push('/recipes')}
              className="text-xs font-black text-orange-500 hover:underline cursor-pointer"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-16 font-bold text-gray-400">Reading public cook logs...</div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
            <p className="text-sm font-bold text-gray-400">No public logs found under "{activeCategory}" yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRecipe(item)}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-4xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-extrabold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors pt-1">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <span>⏱️ {item.duration}</span>
                    <span>★ {item.rating || 5.0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-800/50 mt-4 text-xs font-bold text-gray-400">
                  <span>🧑‍🍳 By {item.authorName}</span>
                  <span className="text-orange-500 text-[11px] font-black">Open Blueprint →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. DETAILS LIGHTBOX MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto border border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase">{selectedRecipe.category}</span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedRecipe.title}</h2>
                <p className="text-xs text-gray-400 font-bold">Document owner: {selectedRecipe.authorName}</p>
              </div>
              <button onClick={() => setSelectedRecipe(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-bold text-xs cursor-pointer">✕</button>
            </div>

            <div className="flex gap-6 border-y border-gray-100 dark:border-gray-800 py-3 text-xs font-bold text-gray-400">
              <div>Prep Duration: <span className="text-gray-900 dark:text-white ml-1">⏱️ {selectedRecipe.duration}</span></div>
              <div>Platform Score: <span className="text-orange-500 ml-1">★ {selectedRecipe.rating}</span></div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Ingredients</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 px-4 py-2 rounded-xl">
                    <span className="text-orange-500 text-xs">🔹</span> {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Instructions Checklist</h4>
              <ol className="space-y-3">
                {selectedRecipe.procedure.map((step, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100/55 dark:border-gray-800/40">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-black">
                      {index + 1}
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

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading Recipes...</div>}>
      <PublicRecipesContent />
    </Suspense>
  );
}