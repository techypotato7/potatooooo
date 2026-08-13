import React from "react";
import { Reveal } from "@/lib/anim";
import { PROCESS } from "@/data";

export default function Process() {
  return (
    <section id="process" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16">
          <Reveal><span className="overline">05 — How We Work</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter max-w-2xl leading-[1.05]">
              A calm, proven process from idea to impact.
            </h2>
          </Reveal>
        </div>

        <div className="border-t border-border">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.06}>
              <div className="group grid md:grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-10 border-b border-border hover:bg-secondary/30 transition-colors duration-500 px-2 md:px-6" data-testid={`process-${i}`}>
                <div className="md:col-span-2 font-display font-black text-5xl md:text-6xl text-stroke group-hover:text-primary group-hover:[-webkit-text-stroke:0] transition-colors duration-500">
                  {p.n}
                </div>
                <h3 className="md:col-span-4 font-display font-bold text-2xl md:text-3xl tracking-tight">{p.title}</h3>
                <p className="md:col-span-6 text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
