
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeName: string;
}

export default function RecipeSuccessModal({ isOpen, onClose, recipeName }: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-4xl p-6 sm:p-8 max-w-md w-full border border-gray-100 dark:border-gray-800 shadow-xl text-center transform scale-100 transition-all">
        
        {/* Animated Checkmark Badge */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 mb-4 text-2xl">
          🍳
        </div>

        {/* Messaging */}
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          Recipe Saved Successfully!
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium px-2">
          Your culinary masterpiece <span className="text-orange-500 font-bold">"{recipeName || "Untitled"}"</span> has been recorded in your cloud digital cookbook.
        </p>

        {/* Navigation Action Anchors */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              router.push("/dashboard"); // Redirect straight back to view grid catalog
            }}
            className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-full transition-all cursor-pointer border border-gray-200 dark:border-gray-800"
          >
            Add Another One
          </button>
        </div>
      </div>
    </div>
  );
}