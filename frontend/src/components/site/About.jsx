import React from "react";
import { Reveal, Counter } from "@/lib/anim";
import { STATS } from "@/data";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="overline">01 — About Techy Potato</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-[1.05]">
                A full-stack studio for brands that refuse to look ordinary.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
                We're Techy Potato — a digital marketing and technology agency delivering complete
                solutions to help businesses, brands and creators grow online. From strategy and design
                to development, AI and marketing, everything lives under one roof so your brand stays
                consistent, sharp and unmistakably premium everywhere it shows up.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-5 font-jb text-sm text-primary">
                Share your requirements, and we'll recommend the best solution for your business.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-md border border-border">
                <img src={ABOUT_IMG} alt="Techy Potato creative studio" className="w-full h-72 lg:h-80 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-md overflow-hidden">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="bg-background p-8 md:p-10 h-full" data-testid={`stat-${i}`}>
                <div className="font-display font-black text-4xl md:text-6xl text-primary tracking-tighter">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 font-jb text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
