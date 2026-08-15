import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Magnetic } from "@/lib/anim";
import { scrollTo } from "@/components/site/Navbar";
import ParticleField from "@/components/site/ParticleField";
import NeonPotato from "@/components/site/NeonPotato";

const EASE = [0.16, 1, 0.3, 1];
const TAGLINE = "YOUR VISION. OUR TECH.";

export default function Hero() {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  const rotX = useTransform(srx, [-0.5, 0.5], [6, -6]);
  const rotY = useTransform(sry, [-0.5, 0.5], [-6, 6]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ry.set((e.clientX - (r.left + r.width / 2)) / r.width);
    rx.set((e.clientY - (r.top + r.height / 2)) / r.height);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 pb-16"
      style={{ perspective: 1000 }}
    >
      <div className="absolute inset-0 -z-10">
        <ParticleField color="70,150,255" />
      </div>
      {/* soft blue light streaks / ambient depth */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[620px] w-[620px] rounded-full bg-[#2E7BFF]/14 blur-[160px]" aria-hidden />
      <div className="absolute -z-10 -top-24 right-10 h-[360px] w-[220px] rotate-12 bg-[#3B9EFF]/8 blur-[120px]" aria-hidden />
      <div className="absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_82%)]" aria-hidden />

      <div className="mx-auto max-w-4xl w-full px-5 md:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-8 bg-[#3B9EFF]" />
          <span className="font-jb text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[#7fbcff]">Digital Marketing & Technology Agency</span>
          <span className="h-px w-8 bg-[#3B9EFF]" />
        </motion.div>

        {/* animated blue circuit network with cursor-driven 3D tilt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          className="relative w-full h-[280px] sm:h-[360px] lg:h-[420px]"
        >
          <NeonPotato />
        </motion.div>

        {/* metallic wordmark with one-time sheen sweep */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4, ease: EASE }}
          className="font-display font-black uppercase tracking-tighter leading-[0.9] text-[15vw] sm:text-[11vw] lg:text-8xl -mt-2 wordmark-sheen"
        >
          Techy Potato
        </motion.h1>

        {/* tagline — character by character */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { delayChildren: 3.4, staggerChildren: 0.045 } } }}
          className="mt-4 font-jb text-sm sm:text-base tracking-[0.35em] uppercase"
          aria-label={TAGLINE}
        >
          {TAGLINE.split("").map((ch, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: EASE }}
              className={i >= TAGLINE.indexOf("OUR") ? "text-[#3B9EFF]" : "text-muted-foreground"}
              aria-hidden="true"
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.9 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          We build complete digital solutions — websites, apps, AI, branding and marketing — that help
          businesses, brands and creators grow online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.1 }}
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
        transition={{ delay: 4.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="font-jb text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
