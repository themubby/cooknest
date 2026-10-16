import React from "react";
import NewsletterForm from "./newsletter-form";

const linkClass = "text-muted hover:text-text transition-colors duration-200";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Recipes", href: "/recipes" },
  { label: "Categories", href: "/dashboard/category" },
  { label: "Add a Recipe", href: "/dashboard/manage?new=1" },
  { label: "About Us", href: "/about" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Community Guidelines", href: "/community-guidelines" },
];

const supportLinks = [
  { label: "Help & Support", href: "/help" },
  { label: "Contact the Team", href: "/help#contact" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border mt-auto text-text dark:bg-gray-900">
      {/* Newsletter band */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-text">Join our kitchen</h3>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Fresh weekly recipes, cooking tips and platform updates, straight to your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
        <div className="col-span-2 md:col-span-5 flex flex-col gap-4">
          <a href="/" className="self-start rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            <img
              src="/image/logo.png"
              alt="CookNest Logo"
              className="h-16 w-auto object-contain dark:rounded-xl dark:bg-gray-100"
              loading="lazy"
            />
          </a>
          <p className="text-sm text-muted max-w-sm leading-relaxed">
            Discover, cook, and share delicious recipes from a community of passionate home cooks.
          </p>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Explore</h4>
          <nav className="flex flex-col gap-2.5 text-sm font-medium">
            {exploreLinks.map((l) => (
              <a key={l.href} href={l.href} className={linkClass}>{l.label}</a>
            ))}
          </nav>
        </div>

        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Legal &amp; Policies</h4>
          <nav className="flex flex-col gap-2.5 text-sm font-medium">
            {legalLinks.map((l) => (
              <a key={l.href} href={l.href} className={linkClass}>{l.label}</a>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Support</h4>
          <nav className="flex flex-col gap-2.5 text-sm font-medium">
            {supportLinks.map((l) => (
              <a key={l.href} href={l.href} className={linkClass}>{l.label}</a>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-muted">
          <span>&copy; {new Date().getFullYear()} CookNest. All rights reserved.</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href="/privacy" className={linkClass}>Privacy</a>
            <a href="/terms" className={linkClass}>Terms</a>
            <a href="/cookies" className={linkClass}>Cookies</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
