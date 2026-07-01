"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useFormik } from 'formik';

interface Recipe {
  id: string;
  title: string;
  duration: string;
  category: string;
  rating: number;
  ingredients: string[];
  image?: string;
}

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts'];

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFilter = searchParams.get('filter') || 'All';
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Inline Modal States
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // FETCH CORE COLLECTION
  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "recipe"));
      const fetchedRecipes: Recipe[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRecipes.push({
          id: doc.id,
          title: data.title || '',
          duration: data.duration || '',
          category: data.category || '',
          rating: data.rating || 5.0,
          ingredients: data.ingredients || [],
          image: data.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=300'
        });
      });
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically re-fetches whenever the user changes category filter tabs
  useEffect(() => {
    fetchRecipes();
  }, [activeFilter]);

  // INLINE DELETE OPERATION
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this recipe from your collection?")) return;
    try {
      await deleteDoc(doc(db, "recipe", id));
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete recipe.");
    }
  };

  // FORMIK MODAL ENGINE
  const formik = useFormik({
    initialValues: {
      title: '',
      duration: '',
      category: '',
      ingredients: ''
    },
    enableReinitialize: true, // Crucial to load active recipe data dynamically
    onSubmit: async (values) => {
      if (!editingRecipe) return;
      setIsSaving(true);
      try {
        const docRef = doc(db, "recipe", editingRecipe.id);
        const updatedData = {
          title: values.title,
          duration: values.duration,
          category: values.category,
          ingredients: values.ingredients.split('\n').filter(i => i.trim() !== '')
        };
        
        await updateDoc(docRef, updatedData);
        
        // Optimistically update state instantly without total reload trigger
        setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? { ...r, ...updatedData } : r));
        setEditingRecipe(null);
      } catch (error) {
        console.error("Error modifying document:", error);
        alert("Failed to update recipe changes.");
      } finally {
        setIsSaving(false);
      }
    }
  });

  // Open modal and load Formik state
  const startEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    formik.setValues({
      title: recipe.title,
      duration: recipe.duration,
      category: recipe.category,
      ingredients: recipe.ingredients.join('\n')
    });
  };

  const filteredRecipes = activeFilter === 'All'
    ? recipes
    : recipes.filter(r => r.category === activeFilter);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Categories</h1>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => router.push(`/dashboard/category?filter=${cat}`)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === cat
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN DATA GRID DISPLAY */}
      {isLoading ? (
        <div className="text-center py-12 text-sm font-bold text-gray-400">Loading your recipes...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipeItem) => (
            <div key={recipeItem.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm flex flex-col group relative">
              <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-950">
                <img src={recipeItem.image} alt={recipeItem.title} className="w-full h-full object-cover" />
                
                {/* ACTION LAYER OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <button 
                    onClick={() => startEdit(recipeItem)}
                    className="p-3 bg-white hover:bg-orange-500 text-gray-900 hover:text-white rounded-full font-bold text-xs transition-colors shadow-lg cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(recipeItem.id)}
                    className="p-3 bg-white hover:bg-red-600 text-gray-900 hover:text-white rounded-full font-bold text-xs transition-colors shadow-lg cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-2">
                <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">{recipeItem.title}</h3>
                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                  <span>⏱️ {recipeItem.duration}</span>
                  <span className="text-orange-500">★ {recipeItem.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INTERACTIVE INLINE MODAL WINDOW */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] max-w-lg w-full border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Quick Edit Recipe</h2>
              <button onClick={() => setEditingRecipe(null)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipe Title</label>
                <input name="title" type="text" required onChange={formik.handleChange} value={formik.values.title} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Duration</label>
                  <input name="duration" type="text" required onChange={formik.handleChange} value={formik.values.duration} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                  <select name="category" onChange={formik.handleChange} value={formik.values.category} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-orange-500">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredients (one per line)</label>
                <textarea name="ingredients" rows={4} onChange={formik.handleChange} value={formik.values.ingredients} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditingRecipe(null)} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-full hover:bg-gray-200 cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-full hover:bg-orange-600 cursor-pointer disabled:opacity-50">{isSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}