import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/data";

export default function ConsultationCTA() {
  return (
    <section className="relative py-16 md:py-20" data-testid="consultation-cta">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-lg border border-primary/30 bg-secondary/40 p-8 md:p-14 text-center"
        >
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-primary/15 blur-[120px]" aria-hidden />
          <span className="inline-flex items-center gap-2 overline">
            <CalendarCheck size={16} /> Free 30-min Consultation
          </span>
          <h2 className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter max-w-3xl mx-auto leading-[1.05]">
            Book a free consultation and get a tailored plan for your business.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Share your requirements — no pressure, no jargon. We'll recommend the best solution to help you grow online.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" data-testid="consult-whatsapp" className="btn-primary">
              Book Free Consultation <ArrowUpRight size={18} />
            </a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} data-testid="consult-call" className="btn-ghost">
              Call {CONTACT.phone}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
