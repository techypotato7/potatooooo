import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/lib/anim";
import { PROJECTS } from "@/data";

export default function Portfolio() {
  return (
    <section id="work" className="relative py-24 md:py-36 bg-secondary/20 border-y border-border">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Reveal><span className="overline">04 — Featured Work</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-[1.05]">
                Selected projects.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-md border border-border cursor-pointer ${i % 3 === 0 ? "md:mt-0" : "md:mt-10"}`}
              data-testid={`project-${i}`}
            >
              <div className="relative h-72 md:h-96 overflow-hidden bg-secondary">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-7 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-jb text-xs uppercase tracking-widest text-primary">{p.cat}</span>
                    <span className="font-jb text-[10px] uppercase tracking-widest text-foreground/80 border border-primary/40 rounded-full px-2.5 py-1 bg-primary/10">{p.result}</span>
                  </div>
                  <h3 className="mt-2 font-display font-bold text-2xl md:text-3xl tracking-tight">{p.title}</h3>
                </div>
                <span className="h-11 w-11 shrink-0 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-500">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
