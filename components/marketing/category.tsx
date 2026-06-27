import React from 'react';

const CATEGORIES_DATA = [
  { id: 1, name: 'Breakfast', count: '120+ Recipes', icon: '🍳', bgClass: 'bg-[#F97316]/10 hover:bg-[#F97316]/20' },
  { id: 2, name: 'Lunch & Mains', count: '340+ Recipes', icon: '🍲', bgClass: 'bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20' },
  { id: 3, name: 'Desserts', count: '85+ Recipes', icon: '🍰', bgClass: 'bg-[#84CC16]/10 hover:bg-[#84CC16]/20' },
  { id: 4, name: 'Vegan & Green', count: '190+ Recipes', icon: '🥗', bgClass: 'bg-emerald-500/10 hover:bg-emerald-500/20' },
  { id: 5, name: 'Quick Bites', count: '60+ Recipes', icon: '🥪', bgClass: 'bg-indigo-500/10 hover:bg-indigo-500/20' },
  { id: 6, name: 'Beverages', count: '110+ Recipes', icon: '🍹', bgClass: 'bg-pink-500/10 hover:bg-pink-500/20' },
];

export default function Categories() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-text">
      
      {/* Section Header Row */}
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div>
          <span className="text-xs sm:text-sm font-bold tracking-widest text-primary uppercase block mb-2">
            Inspiration Focus
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Popular Categories
          </h2>
        </div>
        
        <a 
          href="/recipes" 
          className="text-sm font-semibold text-primary hover:text-secondary flex items-center gap-1 transition-colors duration-200 group pb-1"
        >
          View All Categories 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Dynamic Grid Grid Wrapper - Fully responsive for mobile, tablet, and wide desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {CATEGORIES_DATA.map((category) => (
          <a 
            key={category.id} 
            href={`/recipes?category=${category.name.toLowerCase()}`}
            className={`flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl border border-border/40 shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${category.bgClass}`}
          >
            {/* Round Icon Canvas */}
            <div className="text-3xl sm:text-4xl mb-4 transform scale-100 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            
            {/* Metadata Text */}
            <h3 className="text-base font-bold tracking-tight text-text">
              {category.name}
            </h3>
            <p className="text-xs font-medium text-muted mt-1">
              {category.count}
            </p>
          </a>
        ))}
      </div>

    </section>
  );
}