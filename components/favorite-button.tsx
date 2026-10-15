"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  active: boolean;
  signedIn: boolean;
  onToggle: () => void;
  className?: string;
}

export default function FavoriteButton({ active, signedIn, onToggle, className = "" }: FavoriteButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={signedIn ? (active ? "Remove from favorites" : "Add to favorites") : "Log in to save favorites"}
      onClick={(event) => {
        event.stopPropagation();
        if (!signedIn) {
          router.push("/login");
          return;
        }
        onToggle();
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-base shadow-sm transition hover:scale-110 dark:bg-gray-800/90 cursor-pointer ${className}`}
    >
      {active ? "❤️" : "🤍"}
    </button>
  );
}
