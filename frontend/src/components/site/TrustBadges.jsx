import React from "react";
import { motion } from "framer-motion";
import { TRUST } from "@/data";

export default function TrustBadges() {
  return (
    <section className="relative py-14 md:py-16 border-b border-border" data-testid="trust-badges">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-center font-jb text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
          Trusted capabilities across your entire digital stack
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TRUST.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center justify-center gap-3 border border-border rounded-md py-6 px-3 hover:border-primary/60 transition-colors duration-400"
                data-testid={`trust-${i}`}
              >
                <Icon size={26} strokeWidth={1.5} className="text-muted-foreground group-hover:text-primary transition-colors duration-400" />
                <span className="text-center font-jb text-[11px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{b.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
