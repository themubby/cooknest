// app/recipes/page.tsx
import React from 'react';

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        
        {/* Your Core Vision Hook */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
          Your Personal Digital Cookbook
        </h1>
        
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Organize thousands of delicious recipes from around the world, curated perfectly to inspire your next personal culinary masterpiece.
        </p>

        <div className="pt-4">
          <a 
            href="/dashboard" 
            className="inline-flex items-center justify-center bg-orange-500 text-white font-bold px-8 py-3.5 rounded-full hover:bg-orange-600 transition-all shadow-sm shadow-orange-500/10 active:scale-[0.98]"
          >
            Open Your Dashboard
          </a>
        </div>

      </div>
    </div>
  );
}