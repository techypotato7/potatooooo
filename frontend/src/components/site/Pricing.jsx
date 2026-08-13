import React from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/lib/anim";
import { PLANS } from "@/data";
import { scrollTo } from "@/components/site/Navbar";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <Reveal><span className="overline">07 — Consultation & Plans</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-[1.05]">
              Flexible engagements for every stage.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-muted-foreground">
              Every project is scoped to your goals. Book a free consultation and we'll recommend the right plan.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div
                className={`h-full rounded-md p-8 md:p-10 flex flex-col border transition-colors duration-500 ${p.featured ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"}`}
                data-testid={`plan-${i}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-2xl tracking-tight">{p.name}</h3>
                  <span className={`font-jb text-xs uppercase tracking-widest ${p.featured ? "text-primary-foreground/70" : "text-primary"}`}>{p.price}</span>
                </div>
                <p className={`mt-3 text-sm ${p.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.tagline}</p>
                <ul className="mt-8 space-y-4 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check size={18} className={p.featured ? "text-primary-foreground shrink-0" : "text-primary shrink-0"} />
                      <span className={p.featured ? "text-primary-foreground/90" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollTo("#contact")}
                  data-testid={`plan-cta-${i}`}
                  className={`mt-10 inline-flex items-center justify-center gap-2 font-jb font-bold text-sm uppercase tracking-wider px-6 py-4 rounded-sm transition-colors duration-300 ${p.featured ? "bg-primary-foreground text-primary hover:bg-black" : "border border-white/20 hover:border-primary hover:text-primary"}`}
                >
                  Get Started <ArrowUpRight size={16} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
