"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation'; 

interface Recipe {
  id: string;
  title: string;
  duration: string;
  category: string;
  rating: number;
  ingredients: string[];
  procedure: string[]; // 👈 Array to hold step-by-step instructions
  createdBy: string;
  authorName?: string;
  isPublic: boolean;
}

export default function ManageRecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Detail Panel States
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // 🔍 READ DISPATCHED URL SEARCH PARAMETERS
  const searchParams = useSearchParams();
  const currentSearchQuery = searchParams.get("search")?.toLowerCase() || "";

  // ⚡ DYNAMICALLY FILTER ARRAYS ON THE FLY
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(currentSearchQuery)
  );

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "recipe"));
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
          procedure: data.procedure || [], // 👈 Map incoming database procedure array
          createdBy: data.createdBy || 'anonymous',
          authorName: data.authorName || 'CookNest Chef',
          isPublic: data.isPublic ?? true
        });
      });
      setRecipes(fetched);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: editingRecipe?.title || '',
      duration: editingRecipe?.duration || '',
      category: editingRecipe?.category || 'Breakfast',
      ingredients: editingRecipe?.ingredients.join('\n') || '',
      procedure: editingRecipe?.procedure.join('\n') || '', // 👈 Turn array back into text lines for editing
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        title: values.title,
        duration: values.duration,
        category: values.category,
        ingredients: values.ingredients.split('\n').filter(i => i.trim() !== ''),
        // 🔽 Splits raw text line-by-line into a clean array structure for storage
        procedure: values.procedure.split('\n').filter(p => p.trim() !== ''),
        rating: editingRecipe?.rating || 5.0,
        createdBy: session?.user?.email || "anonymous",
        authorName: session?.user?.name || "CookNest Chef",
        isPublic: true, // Automatically visible in explore feed
        updatedAt: serverTimestamp()
      };

      try {
        if (editingRecipe) {
          await updateDoc(doc(db, "recipe", editingRecipe.id), payload);
        } else {
          await addDoc(collection(db, "recipe"), { ...payload, createdAt: serverTimestamp() });
        }
        fetchRecipes();
        setIsFormOpen(false);
        setEditingRecipe(null);
        resetForm();
      } catch (error) {
        console.error("Database operation failed:", error);
      }
    }
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Permanently delete this recipe?")) return;
    try {
      await deleteDoc(doc(db, "recipe", id));
      setRecipes(prev => prev.filter(r => r.id !== id));
      if (selectedRecipe?.id === id) setSelectedRecipe(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full">
      
      {/* HEADER CONTROLLER SECTION */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Manage Recipes</h1>
          <p className="text-xs font-bold text-gray-400 mt-1">Add, view details, update, or remove kitchen documents.</p>
        </div>
        <button
          onClick={() => { setEditingRecipe(null); setIsFormOpen(true); }}
          className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-full shadow-md transition-all cursor-pointer text-center shrink-0"
        >
          ➕ Add New Recipe
        </button>
      </div>

      {/* RECIPES GRID LIST */}
      {isLoading ? (
        <div className="text-center py-12 font-bold text-gray-400">Loading master files...</div>
      ) : (
        <>
          {filteredRecipes.length === 0 && (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem]">
              <p className="text-sm font-bold text-gray-400">No matching recipes found for "{currentSearchQuery}"</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRecipe(item)}
                className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-4xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                    <span className="text-[10px] bg-green-50 dark:bg-green-950/30 text-green-600 font-bold px-2 py-0.5 rounded-md">🌐 Public</span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors pt-1">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <span>⏱️ {item.duration}</span>
                    <span>★ {item.rating || 5.0}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 dark:border-gray-800/50 mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingRecipe(item); setIsFormOpen(true); }}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-red-500 text-xs font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DYNAMIC DETAIL MODAL (Showing Ingredients & Instructions Side-by-Side) */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase">{selectedRecipe.category}</span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedRecipe.title}</h2>
              </div>
              <button onClick={() => setSelectedRecipe(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-bold text-xs cursor-pointer">✕</button>
            </div>

            <div className="flex gap-6 border-y border-gray-100 dark:border-gray-800 py-3 text-xs font-bold text-gray-500">
              <div>Cooking Duration: <span className="text-gray-900 dark:text-white ml-1">⏱️ {selectedRecipe.duration}</span></div>
              <div>Rating Score: <span className="text-orange-500 ml-1">★ {selectedRecipe.rating || 5.0}</span></div>
            </div>

            {/* List Ingredients */}
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

            {/* 🛠️ NEW: List Step-by-Step Instructions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Step-by-Step Instructions</h4>
              {selectedRecipe.procedure && selectedRecipe.procedure.length > 0 ? (
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
              ) : (
                <p className="text-xs font-bold text-gray-400 italic">No preparation steps specified for this recipe.</p>
              )}
            </div>

            <div className="text-[10px] text-gray-400 font-mono">Created by: {selectedRecipe.createdBy}</div>
          </div>
        </div>
      )}

      {/* ADD/EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-4xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{editingRecipe ? "Edit Recipe" : "Add Masterpiece"}</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <input name="title" type="text" placeholder="Recipe Title" required onChange={formik.handleChange} value={formik.values.title} className="w-full px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input name="duration" type="text" placeholder="e.g., 45 mins" required onChange={formik.handleChange} value={formik.values.duration} className="w-full px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white" />
                <select name="category" onChange={formik.handleChange} value={formik.values.category} className="w-full px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white">
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Ingredients (one per line)</label>
                <textarea name="ingredients" rows={4} placeholder="e.g., 3.5 cups Flour&#10;1 tsp Yeast" onChange={formik.handleChange} value={formik.values.ingredients} className="w-full px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 text-sm font-bold resize-none text-gray-900 dark:text-white" />
              </div>

              {/* 🛠️ NEW: STEP-BY-STEP INSTRUCTIONS ENTRY WORKSPACE */}
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 px-1">Step-by-Step Instructions (one step per line)</label>
                <textarea 
                  name="procedure" 
                  rows={5} 
                  placeholder="e.g., Mix dry ingredients in a large bowl.&#10;Cover tightly and rise for 3 hours." 
                  onChange={formik.handleChange} 
                  value={formik.values.procedure} 
                  className="w-full px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 text-sm font-bold resize-none text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full font-bold text-xs text-gray-500 cursor-pointer">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-orange-500 text-white rounded-full font-bold text-xs cursor-pointer hover:bg-orange-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}