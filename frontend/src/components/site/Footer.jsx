import React from "react";
import { ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/data";
import { scrollTo } from "@/components/site/Navbar";
import { openLegal } from "@/lib/legal";

const QUICK = [
  ["About", "#about"], ["Services", "#services"], ["Work", "#work"],
  ["Process", "#process"], ["Pricing", "#pricing"], ["Contact", "#contact"],
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-background border-t border-border pt-20 md:pt-28 pb-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 pb-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="font-display font-extrabold text-xl tracking-tight">Techy Potato</span>
            </div>
            <p className="mt-6 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter max-w-lg leading-[1.02]">
              Your Vision. <span className="text-primary">Our Tech.</span>
            </p>
            <button onClick={() => scrollTo("#contact")} className="btn-primary mt-8" data-testid="footer-cta">
              Start a Project <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-jb text-xs uppercase tracking-widest text-muted-foreground">Quick Links</h4>
            <ul className="mt-6 space-y-3">
              {QUICK.map(([l, id]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} data-testid={`footer-link-${l.toLowerCase()}`} className="hover:text-primary transition-colors">{l}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-jb text-xs uppercase tracking-widest text-muted-foreground">Get in touch</h4>
            <ul className="mt-6 space-y-3 text-sm">
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors">{CONTACT.email}</a></li>
              <li><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{CONTACT.phone}</a></li>
              <li className="text-muted-foreground">{CONTACT.address}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {CONTACT.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" data-testid={`footer-social-${s.label.toLowerCase()}`} className="font-jb text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">{s.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-jb uppercase tracking-widest">
          <span>© {year} Techy Potato. All rights reserved.</span>
          <div className="flex gap-6">
            <button onClick={() => openLegal("privacy")} className="hover:text-primary transition-colors uppercase tracking-widest" data-testid="footer-privacy">Privacy Policy</button>
            <button onClick={() => openLegal("terms")} className="hover:text-primary transition-colors uppercase tracking-widest" data-testid="footer-terms">Terms</button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none select-none mt-6 overflow-hidden">
        <div className="font-display font-black text-[22vw] leading-none tracking-tighter text-center text-stroke opacity-30">POTATO</div>
      </div>
    </footer>
  );
}
