import React from "react";
import { Reveal } from "@/lib/anim";
import { TESTIMONIALS } from "@/data";

export default function Testimonials() {
  return (
    <section className="relative py-24 md:py-36 bg-secondary/20 border-y border-border">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16">
          <Reveal><span className="overline">06 — Client Words</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-[1.05]">
              Trusted by ambitious brands.
            </h2>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <figure className="h-full bg-background border border-border rounded-md p-8 md:p-10 flex flex-col justify-between hover:border-primary/50 transition-colors duration-500" data-testid={`testimonial-${i}`}>
                <span className="font-display text-6xl leading-none text-primary">“</span>
                <blockquote className="mt-2 font-display font-medium text-xl md:text-2xl tracking-tight leading-snug">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 pt-6 border-t border-border">
                  <div className="font-bold">{t.name}</div>
                  <div className="font-jb text-xs uppercase tracking-widest text-muted-foreground mt-1">{t.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
