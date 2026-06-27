import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border mt-auto text-text">
      {/* Top Main Section: Brand Context, Links Matrix, & News Gating */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        
        {/* Column 1: Core Brand Identity (Takes up 4 grid slots on wide screens) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <a href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg self-start">
            <img 
              src="/image/logo.png" 
              alt="CookNest Logo" 
              className="h-30 w-auto object-contain" 
              loading="lazy"
            />
          </a>
          <p className="text-sm text-muted max-w-sm leading-relaxed font-normal">
            Discover, cook, and share delicious recipes from a community of passionate home cooks. Empowering your everyday culinary adventures.
          </p>
        </div>

        {/* Column 2: Quick Platform Links (Takes up 2 grid slots) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Explore</h4>
          <nav className="flex flex-col gap-2.5 text-sm font-medium">
            <a href="#" className="text-muted hover:text-text transition-colors duration-200">Home</a>
            <a href="/recipes" className="text-muted hover:text-text transition-colors duration-200">Recipes</a>
            <a href="#" className="text-muted hover:text-text transition-colors duration-200">Categories</a>
            <a href="#" className="text-muted hover:text-text transition-colors duration-200">About Us</a>
          </nav>
        </div>

        {/* Column 3: Legal & Support Information (Takes up 2 grid slots) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Legal</h4>
          <nav className="flex flex-col gap-2.5 text-sm font-medium">
            <a href="#" className="text-muted hover:text-text transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-muted hover:text-text transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-muted hover:text-text transition-colors duration-200">Cookie Settings</a>
            <a href="#" className="text-muted hover:text-text transition-colors duration-200">Help Support</a>
          </nav>
        </div>

        {/* Column 4: Newsletter Box - Clean 100% Server Safe Native Form Layout */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Join Our Kitchen</h4>
          <p className="text-sm text-muted leading-relaxed font-normal">
            Subscribe to receive fresh weekly recipes, cooking tips, and platform updates directly in your inbox.
          </p>
          <form action="/api/newsletter" method="POST" className="flex gap-2 mt-2">
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email address"
              required
              className="bg-background border border-border rounded-full px-1.5 py-2.5 text-sm w-full focus:outline-none focus:border-primary focus:bg-white transition-all text-text"
            />
            <button 
              type="submit" 
              className="bg-primary text-white font-semibold text-sm px-1.5 py-1.5 rounded-full hover:bg-opacity-90 shadow-sm transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Compliance Frame: Metadata Details */}
      <div className="border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-muted">
          <span>&copy; {new Date().getFullYear()} CookNest Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Built for food lovers everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}