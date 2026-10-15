"use client";

import React from "react";
import FavoriteButton from "@/components/favorite-button";
import { useFavorites } from "@/lib/use-favorites";

// Self-contained heart for server-rendered pages such as the recipe detail page.
export default function RecipeFavoriteButton({ recipeId }: { recipeId: string }) {
  const { favoriteIds, toggleFavorite, signedIn } = useFavorites();

  return (
    <FavoriteButton
      active={favoriteIds.has(recipeId)}
      signedIn={signedIn}
      onToggle={() => toggleFavorite(recipeId)}
      className="h-10 w-10 border border-gray-100 dark:border-gray-800"
    />
  );
}
