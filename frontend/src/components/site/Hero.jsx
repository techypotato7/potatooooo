import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Magnetic } from "@/lib/anim";
import { scrollTo } from "@/components/site/Navbar";
import ParticleField from "@/components/site/ParticleField";
import NeonPotato from "@/components/site/NeonPotato";

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 pb-16">
      {/* particle constellation */}
      <div className="absolute inset-0 -z-10">
        <ParticleField />
      </div>
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full bg-primary/12 blur-[150px]" aria-hidden />
      <div className="absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_80%)]" aria-hidden />

      <div className="mx-auto max-w-4xl w-full px-5 md:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-8 bg-primary" />
          <span className="overline">Digital Marketing & Technology Agency</span>
          <span className="h-px w-8 bg-primary" />
        </motion.div>

        {/* animated neon potato network */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="relative w-full h-[280px] sm:h-[360px] lg:h-[420px]"
        >
          <NeonPotato />
        </motion.div>

        {/* wordmark */}
        <h1 className="font-display font-black uppercase tracking-tighter leading-[0.9] text-[15vw] sm:text-[11vw] lg:text-8xl -mt-2">
          <span className="inline-block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5, ease: EASE }} className="inline-block">
              Techy <span className="text-primary">Potato</span>
            </motion.span>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-4 font-jb text-sm sm:text-base tracking-[0.35em] uppercase text-muted-foreground"
        >
          Your Vision. <span className="text-primary">Our Tech.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          We build complete digital solutions — websites, apps, AI, branding and marketing — that help
          businesses, brands and creators grow online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <button onClick={() => scrollTo("#contact")} data-testid="hero-cta-primary" className="btn-primary">
              Start Your Project <ArrowUpRight size={18} />
            </button>
          </Magnetic>
          <button onClick={() => scrollTo("#work")} data-testid="hero-cta-secondary" className="btn-ghost">
            View Our Work
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="font-jb text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
