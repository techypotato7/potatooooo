import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/lib/anim";
import { FAQS } from "@/data";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative py-24 md:py-36 bg-secondary/20 border-y border-border">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="mb-14 text-center">
          <Reveal><span className="overline">08 — FAQ</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-[1.05]">
              Good questions, straight answers.
            </h2>
          </Reveal>
        </div>

        <div className="border-t border-border">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-border" data-testid={`faq-${i}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-display font-bold text-lg md:text-2xl tracking-tight group-hover:text-primary transition-colors">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-primary">
                    <Plus size={24} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-muted-foreground leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
