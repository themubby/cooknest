import React from 'react';


const RECIPES_DATA = [
  {
    id: 1,
    title: 'Creamy Garlic Butter Salmon',
    category: 'Lunch & Mains',
    time: '25 mins',
    difficulty: 'Easy',
    rating: '4.9',
    reviews: '92',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600',
    author: { name: 'Chef Elena', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' }
  },
  {
    id: 2,
    title: 'Authentic Berry Fluffy Pancakes',
    category: 'Breakfast',
    time: '20 mins',
    difficulty: 'Easy',
    rating: '4.8',
    reviews: '154',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600',
    author: { name: 'Marcus K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' }
  },
  {
    id: 3,
    title: 'Zesty Avocado Quinoa Salad Bowl',
    category: 'Vegan & Green',
    time: '15 mins',
    difficulty: 'Easy',
    rating: '4.7',
    reviews: '48',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    author: { name: 'Sarah Green', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' }
  },
  {
    id: 4,
    title: 'Matcha White Chocolate Lava Cake',
    category: 'Desserts',
    time: '35 mins',
    difficulty: 'Medium',
    rating: '5.0',
    reviews: '210',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
    author: { name: 'Yuki Tanaka', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' }
  }
];

export default function RecipeFeed() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-text">
      
      {/* Feed Heading Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs sm:text-sm font-bold tracking-widest text-primary uppercase block mb-2">
            Hand-picked For You
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Trending Recipes
          </h2>
        </div>
        
        {/* Simple Tab Filters for Quick Sorting */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button className="bg-primary text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap shadow-sm">
            All Content
          </button>
          <button className="bg-surface text-muted hover:text-text border border-border text-xs sm:text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition-colors">
            Most Liked
          </button>
          <button className="bg-surface text-muted hover:text-text border border-border text-xs sm:text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition-colors">
            Fastest Prep
          </button>
        </div>
      </div>

      {/* 4-Column Fluid Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {RECIPES_DATA.map((recipe) => (
          <article 
            key={recipe.id} 
            className="group bg-white rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            {/* Aspect Frame Image Wrapper */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-background">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Category Floating Pill Indicator */}
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-full text-text shadow-sm border border-white/20">
                {recipe.category}
              </span>
            </div>

            {/* Meta Typography Block */}
            <div className="p-5 sm:p-6 flex flex-col flex-grow">
              
              {/* Score Metric Line */}
              <div className="flex items-center gap-1 text-xs font-bold text-text mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary fill-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{recipe.rating}</span>
                <span className="text-muted font-normal">({recipe.reviews} reviews)</span>
              </div>

              {/* Dynamic Recipe Title Link */}
              <a href={`/recipes/${recipe.id}`} className="block group-hover:text-primary transition-colors duration-200">
                <h3 className="text-lg font-bold text-text tracking-tight leading-snug line-clamp-2 min-h-[3.5rem]">
                  {recipe.title}
                </h3>
              </a>

              {/* Footer Separator Line */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted font-semibold">
                
                {/* Author Avatar Info */}
                <div className="flex items-center gap-2">
                  <img src={recipe.author.avatar} alt={recipe.author.name} className="w-6 h-6 rounded-full object-cover border border-border" />
                  <span className="text-text font-medium truncate max-w-[80px]">{recipe.author.name}</span>
                </div>

                {/* Clock / Complexity Specifications */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0114 0z" />
                    </svg>
                    {recipe.time}
                  </span>
                  <span className="bg-background text-accent px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
                    {recipe.difficulty}
                  </span>
                </div>

              </div>
            </div>

          </article>
        ))}
      </div>

    </section>
  );
}