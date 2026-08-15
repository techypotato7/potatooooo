import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Work", "#work"],
  ["Process", "#process"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
];

export const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => { setOpen(false); scrollTo(id); };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${scrolled ? "glass border-b border-white/10" : "bg-transparent"}`}
      data-testid="site-navbar"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <button onClick={() => go("#top")} data-testid="nav-logo" className="flex items-center gap-2.5 group">
          <img
            src="/techy-potato-logo.jpeg"
            alt="Techy Potato"
            className="h-9 md:h-10 w-auto rounded-md ring-1 ring-white/10 group-hover:ring-primary/50 transition-[box-shadow,transform] duration-300 group-hover:scale-105"
          />
          <span className="font-display font-extrabold text-base md:text-lg tracking-tight">Techy Potato</span>
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => go(id)}
              data-testid={`nav-${label.toLowerCase()}`}
              className="font-jb text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => go("#contact")} data-testid="nav-cta" className="hidden sm:inline-flex btn-primary !px-5 !py-2.5 !text-xs">
            Start a Project
          </button>
          <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle" aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden glass border-t border-white/10"
          >
            <div className="px-5 py-6 flex flex-col gap-4">
              {LINKS.map(([label, id]) => (
                <button key={id} onClick={() => go(id)} className="text-left font-display text-2xl font-bold" data-testid={`nav-mobile-${label.toLowerCase()}`}>
                  {label}
                </button>
              ))}
              <button onClick={() => go("#contact")} className="btn-primary mt-2" data-testid="nav-mobile-cta">Start a Project</button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
