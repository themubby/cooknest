import React from "react";

export interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Legal</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-text">{title}</h1>
      <p className="mt-2 text-xs font-semibold text-muted">Last updated: {updated}</p>
      <p className="mt-6 text-sm sm:text-base leading-relaxed text-muted">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="text-lg font-extrabold text-text">
              {i + 1}. {s.heading}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} className="mt-2 text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6 text-xs font-semibold">
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
        <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>
        <a href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</a>
        <a href="/help" className="text-primary hover:underline">Help &amp; Support</a>
      </div>
    </div>
  );
}
