import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { MaskLine, Magnetic } from "@/lib/anim";
import { scrollTo } from "@/components/site/Navbar";
import ParticleField from "@/components/site/ParticleField";

export default function Hero() {
  const { scrollY } = useScroll();
  const yFade = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-28 pb-16">
      {/* particle constellation */}
      <div className="absolute inset-0 -z-10">
        <ParticleField />
      </div>
      {/* soft neon gradients */}
      <div className="absolute -z-10 -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[150px]" aria-hidden />
      <div className="absolute -z-10 bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[150px]" aria-hidden />
      <div className="absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_78%)]" aria-hidden />

      <motion.div style={{ y: yFade, opacity }} className="mx-auto max-w-7xl w-full px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-10 bg-primary" />
          <span className="overline">Digital Marketing & Technology Agency</span>
        </motion.div>

        <h1 className="font-display font-black uppercase leading-[0.9] tracking-tighter text-[15vw] sm:text-[12vw] lg:text-[9.5rem]">
          <MaskLine delay={0.15}>Your Vision.</MaskLine>
          <MaskLine delay={0.32} className="text-primary">Our Tech.</MaskLine>
        </h1>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-md text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            We build complete digital solutions — websites, apps, AI, branding and marketing — that help
            businesses, brands and creators grow online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="flex flex-wrap items-center gap-4"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="font-jb text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
