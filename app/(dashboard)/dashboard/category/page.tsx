"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useFormik } from "formik";
import FavoriteButton from "@/components/favorite-button";
import RecipeThumb from "@/components/recipe-thumb";
import { getFavoriteIds } from "@/lib/favorites";
import { useFavorites } from "@/lib/use-favorites";

interface Recipe {
  id: string;
  title: string;
  duration: string;
  category: string;
  rating: number;
  ingredients: string[];
  createdBy: string;
  image?: string;
}

const FILTERS = ["All", "Breakfast", "Lunch", "Dinner", "Desserts", "Favorites"];

function toRecipe(id: string, data: Record<string, any>): Recipe {
  return {
    id,
    title: data.title || "",
    duration: data.duration || "",
    category: data.category || "",
    rating: data.rating || 5.0,
    ingredients: data.ingredients || [],
    createdBy: data.createdBy || "",
    image: data.image || undefined,
  };
}

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email ?? null;
  const activeFilter = searchParams.get("filter") || "All";

  const { favoriteIds, toggleFavorite, signedIn } = useFavorites();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Own recipes for every tab except Favorites, which loads saved recipes (any author).
  const fetchRecipes = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      if (activeFilter === "Favorites") {
        const ids = await getFavoriteIds(email);
        const snapshots = await Promise.all(ids.map((id) => getDoc(doc(db, "recipe", id))));
        setRecipes(snapshots.filter((s) => s.exists()).map((s) => toRecipe(s.id, s.data()!)));
      } else {
        const snapshot = await getDocs(query(collection(db, "recipe"), where("createdBy", "==", email)));
        setRecipes(snapshot.docs.map((d) => toRecipe(d.id, d.data())));
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, activeFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this recipe from your collection?")) return;
    try {
      await deleteDoc(doc(db, "recipe", id));
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete recipe.");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const wasFavorite = favoriteIds.has(id);
    await toggleFavorite(id);
    // In the Favorites tab an un-hearted recipe should disappear straight away
    if (activeFilter === "Favorites" && wasFavorite) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    }
  };

  const formik = useFormik({
    initialValues: { title: "", duration: "", category: "", ingredients: "" },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!editingRecipe) return;
      setIsSaving(true);
      try {
        const updatedData = {
          title: values.title,
          duration: values.duration,
          category: values.category,
          ingredients: values.ingredients.split("\n").filter((i) => i.trim() !== ""),
        };
        await updateDoc(doc(db, "recipe", editingRecipe.id), updatedData);
        setRecipes((prev) => prev.map((r) => (r.id === editingRecipe.id ? { ...r, ...updatedData } : r)));
        setEditingRecipe(null);
      } catch (error) {
        console.error("Error modifying document:", error);
        alert("Failed to update recipe changes.");
      } finally {
        setIsSaving(false);
      }
    },
  });

  const startEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    formik.setValues({
      title: recipe.title,
      duration: recipe.duration,
      category: recipe.category,
      ingredients: recipe.ingredients.join("\n"),
    });
  };

  const filteredRecipes =
    activeFilter === "All" || activeFilter === "Favorites"
      ? recipes
      : recipes.filter((r) => r.category === activeFilter);

  const emptyMessage =
    activeFilter === "Favorites"
      ? "No favorites yet. Tap the heart on any recipe to save it here."
      : activeFilter === "All"
        ? "You haven't added any recipes yet."
        : `You have no ${activeFilter} recipes yet.`;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          {activeFilter === "Favorites" ? "Favorites" : "Categories"}
        </h1>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => router.push(`/dashboard/category?filter=${encodeURIComponent(filter)}`)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === filter
                ? "bg-orange-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            }`}
          >
            {filter === "Favorites" ? "🧡 Favorites" : filter}
          </button>
        ))}
      </div>

      {/* MAIN DATA GRID DISPLAY */}
      {isLoading ? (
        <div className="text-center py-12 text-sm font-bold text-gray-400">Loading your recipes...</div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem]">
          <p className="text-sm font-bold text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipeItem) => {
            const isMine = recipeItem.createdBy === email;
            return (
              <div
                key={recipeItem.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm flex flex-col relative"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
                  <a href={`/recipes/${recipeItem.id}`}>
                    <RecipeThumb category={recipeItem.category} image={recipeItem.image} title={recipeItem.title} />
                  </a>
                  <div className="absolute top-3 right-3">
                    <FavoriteButton
                      active={favoriteIds.has(recipeItem.id)}
                      signedIn={signedIn}
                      onToggle={() => handleToggleFavorite(recipeItem.id)}
                    />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <a
                      href={`/recipes/${recipeItem.id}`}
                      className="font-extrabold text-gray-900 dark:text-white text-sm hover:text-orange-500 transition-colors block"
                    >
                      {recipeItem.title}
                    </a>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                      <span>⏱️ {recipeItem.duration}</span>
                      <span className="text-orange-500">★ {recipeItem.rating}</span>
                    </div>
                  </div>

                  {/* Edit/Delete only for your own recipes, always visible (works on touch screens) */}
                  {isMine && (
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                      <button
                        onClick={() => startEdit(recipeItem)}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipeItem.id)}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-red-500 text-xs font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INLINE EDIT MODAL */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] max-w-lg w-full border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Quick Edit Recipe</h2>
              <button onClick={() => setEditingRecipe(null)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer dark:hover:text-gray-300">✕</button>
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
