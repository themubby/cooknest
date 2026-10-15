"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { addFavorite, getFavoriteIds, removeFavorite } from "./favorites";

const NO_FAVORITES: ReadonlySet<string> = new Set();

export function useFavorites() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? null;
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    getFavoriteIds(email)
      .then((ids) => {
        if (!cancelled) setFavoriteIds(new Set(ids));
      })
      .catch((error) => console.error("Could not load favorites:", error));
    return () => {
      cancelled = true;
    };
  }, [email]);

  const toggleFavorite = useCallback(
    async (recipeId: string) => {
      if (!email) return;
      const wasFavorite = favoriteIds.has(recipeId);

      // Update the heart immediately, undo if the database write fails
      setFavoriteIds((previous) => {
        const next = new Set(previous);
        if (wasFavorite) next.delete(recipeId);
        else next.add(recipeId);
        return next;
      });

      try {
        if (wasFavorite) await removeFavorite(email, recipeId);
        else await addFavorite(email, recipeId);
      } catch (error) {
        console.error("Could not update favorite:", error);
        setFavoriteIds((previous) => {
          const next = new Set(previous);
          if (wasFavorite) next.add(recipeId);
          else next.delete(recipeId);
          return next;
        });
      }
    },
    [email, favoriteIds]
  );

  return {
    favoriteIds: email ? favoriteIds : NO_FAVORITES,
    toggleFavorite,
    signedIn: Boolean(email),
  };
}
