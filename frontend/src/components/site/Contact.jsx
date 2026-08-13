import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Phone, Mail, MapPin, ArrowUpRight, Loader2 } from "lucide-react";
import { Reveal } from "@/lib/anim";
import { CONTACT } from "@/data";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Thanks! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-b border-border py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <section id="contact" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20">
          {/* Left: heading + details */}
          <div className="lg:col-span-5">
            <Reveal><span className="overline">09 — Let's Build</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[0.95]">
                Start your <span className="text-primary">project.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
                Share your requirements and we'll recommend the best solution for your business. Free consultation, no pressure.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 space-y-5">
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} data-testid="contact-phone" className="flex items-center gap-4 group">
                  <span className="h-11 w-11 rounded-full border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Phone size={18} /></span>
                  <span className="group-hover:text-primary transition-colors">{CONTACT.phone}</span>
                </a>
                <a href={`mailto:${CONTACT.email}`} data-testid="contact-email" className="flex items-center gap-4 group">
                  <span className="h-11 w-11 rounded-full border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Mail size={18} /></span>
                  <span className="group-hover:text-primary transition-colors">{CONTACT.email}</span>
                </a>
                <div className="flex items-center gap-4" data-testid="contact-address">
                  <span className="h-11 w-11 rounded-full border border-border flex items-center justify-center text-primary"><MapPin size={18} /></span>
                  <span className="text-muted-foreground max-w-xs">{CONTACT.address}</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-8 flex flex-wrap gap-3">
                {CONTACT.socials.map((s) => (
                  <a key={s.label} href={s.href} data-testid={`social-${s.label.toLowerCase().replace(/[^a-z]/g, "")}`} className="font-jb text-xs uppercase tracking-widest border border-border rounded-sm px-4 py-2.5 hover:border-primary hover:text-primary transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-6" data-testid="contact-form">
                <div className="sm:col-span-1">
                  <input className={inputCls} placeholder="Your name" value={form.name} onChange={set("name")} data-testid="input-name" />
                </div>
                <div className="sm:col-span-1">
                  <input className={inputCls} type="email" placeholder="Email address" value={form.email} onChange={set("email")} data-testid="input-email" />
                </div>
                <div className="sm:col-span-1">
                  <input className={inputCls} placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} data-testid="input-phone" />
                </div>
                <div className="sm:col-span-1">
                  <input className={inputCls} placeholder="Service you need" value={form.service} onChange={set("service")} data-testid="input-service" />
                </div>
                <div className="sm:col-span-2">
                  <textarea rows={4} className={`${inputCls} resize-none`} placeholder="Tell us about your project" value={form.message} onChange={set("message")} data-testid="input-message" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto" data-testid="contact-submit">
                    {loading ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <>Send Requirements <ArrowUpRight size={18} /></>}
                  </button>
                </div>
              </form>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-10 rounded-md overflow-hidden border border-border" data-testid="contact-map">
                <iframe
                  title="Techy Potato location"
                  src="https://www.google.com/maps?q=India&z=4&output=embed"
                  width="100%"
                  height="240"
                  style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(0.9)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
