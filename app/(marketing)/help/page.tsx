import React from "react";

export const metadata = { title: "Help & Support | CookNest" };

const faqs = [
  { q: "How do I add a recipe?", a: "Sign in, open Manage from your dashboard and choose Add Recipe. You can keep a recipe private or publish it." },
  { q: "How do I save a favorite?", a: "Tap the heart on any recipe card. Your saved recipes appear under Favorites in your dashboard." },
  { q: "I can't sign in. What should I do?", a: "Check your email and password, or use Sign in with Google. If you registered with Google, use that button rather than a password." },
  { q: "How do I change my name or photo?", a: "Open Profile in your dashboard, edit your display name or upload a new photo, then save." },
  { q: "How do I delete my account?", a: "Contact us using the email below and we will remove your account and data." },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Support</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-text">Help &amp; Support</h1>
      <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted">
        Quick answers to common questions. Can&apos;t find what you need? Get in touch.
      </p>

      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-white p-5 dark:bg-gray-900">
            <summary className="cursor-pointer list-none text-sm font-bold text-text flex items-center justify-between gap-4">
              {f.q}
              <span className="text-primary transition-transform group-open:rotate-45 text-lg leading-none">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>

      <div id="contact" className="mt-10 scroll-mt-24 rounded-3xl border border-border bg-white p-6 dark:bg-gray-900">
        <h2 className="text-base font-extrabold text-text">Contact us</h2>
        <p className="mt-1 text-sm text-muted">
          Email us at{" "}
          <a href="mailto:muba0829@gmail.com" className="font-semibold text-primary hover:underline">
            muba0829@gmail.com
          </a>{" "}
          and we&apos;ll get back to you.
        </p>
      </div>
    </div>
  );
}
