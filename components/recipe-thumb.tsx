import React from "react";

// A tidy stand-in for a recipe photo: an emoji on a soft colour gradient per category.
// If a recipe has its own image it is shown instead.
const STYLES: Record<string, { emoji: string; gradient: string }> = {
  Breakfast: {
    emoji: "🍳",
    gradient: "from-amber-100 to-orange-200 dark:from-amber-950 dark:to-orange-900",
  },
  Lunch: {
    emoji: "🍲",
    gradient: "from-orange-100 to-red-200 dark:from-orange-950 dark:to-red-900",
  },
  Dinner: {
    emoji: "🍽️",
    gradient: "from-indigo-100 to-purple-200 dark:from-indigo-950 dark:to-purple-900",
  },
  Desserts: {
    emoji: "🍰",
    gradient: "from-pink-100 to-rose-200 dark:from-pink-950 dark:to-rose-900",
  },
};

const DEFAULT_STYLE = {
  emoji: "🍴",
  gradient: "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800",
};

export function categoryEmoji(category?: string): string {
  return (STYLES[category ?? ""] ?? DEFAULT_STYLE).emoji;
}

interface RecipeThumbProps {
  category?: string;
  image?: string;
  title: string;
  /** "card" fills its parent; "small" is for list rows (use with a fixed-size parent). */
  size?: "card" | "small";
}

export default function RecipeThumb({ category, image, title, size = "card" }: RecipeThumbProps) {
  if (image) {
    return <img src={image} alt={title} className="h-full w-full object-cover" />;
  }

  const style = STYLES[category ?? ""] ?? DEFAULT_STYLE;

  return (
    <div
      role="img"
      aria-label={`${category || "Recipe"}: ${title}`}
      className={`flex h-full w-full items-center justify-center bg-linear-to-br ${style.gradient}`}
    >
      <span className={size === "small" ? "text-2xl" : "text-6xl drop-shadow-sm"} aria-hidden="true">
        {style.emoji}
      </span>
    </div>
  );
}
