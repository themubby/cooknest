import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { auth } from "@/auth";
import RecipeFavoriteButton from "@/components/recipe-favorite-button";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data: Record<string, any> | undefined;
  try {
    const snapshot = await getDoc(doc(db, "recipe", id));
    data = snapshot.exists() ? snapshot.data() : undefined;
  } catch (error) {
    console.error("Could not load recipe:", error);
  }

  if (!data) notFound();

  // Recipes marked private are only visible to their owner
  if (data.isPublic === false) {
    const session = await auth();
    if (session?.user?.email !== data.createdBy) notFound();
  }

  const ingredients: string[] = Array.isArray(data.ingredients) ? data.ingredients : [];
  const procedure: string[] = Array.isArray(data.procedure) ? data.procedure : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link href="/recipes" className="text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors">
        ← Back to recipes
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase">
            {data.category || "Recipe"}
          </span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{data.title}</h1>
          <p className="text-xs font-bold text-gray-400">By {data.authorName || "Community Chef"}</p>
        </div>
        <RecipeFavoriteButton recipeId={id} />
      </div>

      <div className="flex gap-6 border-y border-gray-100 dark:border-gray-800 py-3 text-xs font-bold text-gray-500 dark:text-gray-400">
        <div>
          Duration: <span className="text-gray-900 dark:text-white ml-1">⏱️ {data.duration}</span>
        </div>
        <div>
          Rating: <span className="text-orange-500 ml-1">★ {data.rating || 5.0}</span>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">Ingredients</h2>
        {ingredients.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 px-4 py-2 rounded-xl"
              >
                <span className="text-orange-500 text-xs">🔹</span> {ingredient}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs font-bold text-gray-400 italic">No ingredients listed.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">Step-by-Step Instructions</h2>
        {procedure.length > 0 ? (
          <ol className="space-y-3">
            {procedure.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100/55 dark:border-gray-800/40"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-black">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs font-bold text-gray-400 italic">No preparation steps specified.</p>
        )}
      </section>
    </div>
  );
}
