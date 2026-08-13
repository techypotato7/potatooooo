import React from "react";
import { Reveal } from "@/lib/anim";
import { WHY_US } from "@/data";

export default function WhyUs() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal><span className="overline">03 — Why Choose Us</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-[1.05]">
                Built different. On purpose.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                We combine design taste, engineering rigour and marketing strategy to deliver work that
                doesn't just look premium — it performs.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-border border border-border rounded-md overflow-hidden">
            {WHY_US.map((w, i) => (
              <Reveal key={w.k} delay={i * 0.08}>
                <div className="group bg-background p-8 md:p-10 h-full hover:bg-secondary/40 transition-colors duration-500" data-testid={`why-${i}`}>
                  <span className="font-display font-black text-5xl text-stroke group-hover:text-primary group-hover:[-webkit-text-stroke:0] transition-colors duration-500">{w.k}</span>
                  <h3 className="mt-6 font-display font-bold text-xl md:text-2xl tracking-tight">{w.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
