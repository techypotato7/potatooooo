import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/lib/anim";
import { SERVICES } from "@/data";

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-36 bg-secondary/20 border-y border-border">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Reveal><span className="overline">02 — What We Do</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter max-w-2xl leading-[1.05]">
                Complete digital solutions, engineered end-to-end.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-muted-foreground max-w-xs md:text-right">
              Fourteen ways we help you show up sharper, sell more, and grow faster online.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-md overflow-hidden">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-background p-8 md:p-9 min-h-[220px] flex flex-col justify-between hover:bg-secondary/40 transition-colors duration-500"
                data-testid={`service-card-${i}`}
              >
                <div className="flex items-start justify-between">
                  <Icon className="text-primary" size={30} strokeWidth={1.5} />
                  <span className="font-jb text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
