import React from 'react';

export default function Hero() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-text">
      
      {/* Left Column: Typography Content Layout */}
      <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Organize.<br className="hidden lg:block" />
          <span className="text-primary">Cook.</span><br />
          Share.<br className="hidden lg:block" />
          Repeat.
        </h1>
        
        <p className="mt-6 text-muted text-base sm:text-lg max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
          Bring order to your kitchen. Seamlessly manage your favorite ingredients, store cooking instructions, and curate your own collection of global flavors
        </p>
        
        {/* Core CTA Buttons (Matches Section 1 Design) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <a 
            href="/dashboard/add-recipe" 
            className="w-full sm:w-auto bg-primary text-white text-center font-semibold px-8 py-3.5 rounded-full hover:bg-opacity-90 shadow-md shadow-primary/10 transition-all"
          >
            Add your Recipe
          </a>
          
        </div>
      </div>

      {/* Right Column: Asymmetric Showcase Frame & Floating Recipe Card */}
      <div className="lg:col-span-7 relative flex justify-center items-center order-1 lg:order-2 px-4 sm:px-0">
        
        {/* Subtle decorative color bloom behind the main showcase */}
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full filter blur-3xl transform -translate-x-4" />

        {/* The Signature Big Circular Recipe Frame */}
        <div className="relative w-full max-w-[480px] aspect-square rounded-full overflow-hidden border-[12px] border-white shadow-2xl shadow-text/5 z-10 bg-white">
          <img 
            src="/image/partyjollof.png" 
            alt="Party Jollof" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="eager"
          />
        </div>

        {/* Floating "Spaghetti Carbonara" Overlay Badge Card */}
        <div className="absolute bottom-4 right-4 sm:right-10 lg:right-2 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border/60 z-20 flex items-center gap-3 max-w-[240px] transition-transform duration-300 hover:scale-105">
          
          {/* Card Mini Thumbnail */}
          <img 
            src="/image/partyjollof.png" 
            alt="Nigeria Party jollof" 
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            loading="lazy"
          />
          
          {/* Card Recipe Metadata */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-bold text-text truncate">Nigeria Party jollof</h4>
            
            {/* Star Rating Layout */}
            <div className="flex items-center gap-1 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-secondary fill-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-text">4.8</span>
              <span className="text-[10px] text-muted">(130)</span>
            </div>

            {/* Time Metrics & Difficulty Badges */}
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted font-medium">
              <div className="flex items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0114 0z" />
                </svg>
                <span>30 mins</span>
              </div>
              
              <div className="flex items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0114 0z" />
                </svg>
                <span>Easy</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}