import React from "react";

const ITEMS = ["Websites", "Mobile Apps", "AI Solutions", "Branding", "SEO", "Social Media", "Growth"];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section className="relative border-y border-border py-6 overflow-hidden bg-secondary/30" aria-hidden data-testid="marquee">
      <div className="flex whitespace-nowrap marquee-track">
        {row.map((t, i) => (
          <div key={i} className="flex items-center">
            <span className="font-display font-extrabold text-2xl md:text-4xl px-8 uppercase tracking-tight">{t}</span>
            <span className="text-primary text-2xl md:text-4xl">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}
