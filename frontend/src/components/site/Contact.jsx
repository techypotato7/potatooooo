import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight, Loader2, Lock } from "lucide-react";
import { Reveal } from "@/lib/anim";
import { CONTACT, FORM_SERVICES } from "@/data";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", company_website: "" });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleService = (s) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }

    // Build a professional WhatsApp message and open it (works on mobile app + web).
    const waText =
      `🥔 *New Project Enquiry — Techy Potato*\n\n` +
      `👤 *Name:* ${form.name}\n` +
      `📧 *Email:* ${form.email}\n` +
      `📱 *Phone:* ${form.phone || "N/A"}\n` +
      `🧩 *Services:* ${services.length ? services.join(", ") : "Not specified"}\n` +
      `📝 *Project:* ${form.message}\n` +
      `🕒 *Sent:* ${new Date().toLocaleString("en-IN")}`;
    const waUrl = `https://wa.me/917973696769?text=${encodeURIComponent(waText)}`;
    // open synchronously within the click gesture to avoid popup blocking
    window.open(waUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp with your requirements…");

    // save the lead in the background for your records
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, { ...form, services });
    } catch (err) {
      // saving is best-effort; the WhatsApp message has already opened
    } finally {
      setForm({ name: "", email: "", phone: "", message: "", company_website: "" });
      setServices([]);
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
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" data-testid={`social-${s.label.toLowerCase().replace(/[^a-z]/g, "")}`} className="font-jb text-xs uppercase tracking-widest border border-border rounded-sm px-4 py-2.5 hover:border-primary hover:text-primary transition-colors">
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
                {/* honeypot — hidden from users, traps bots */}
                <input
                  type="text"
                  name="company_website"
                  value={form.company_website}
                  onChange={set("company_website")}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] w-px h-px opacity-0"
                />
                <div className="sm:col-span-1">
                  <input className={inputCls} placeholder="Your name" value={form.name} onChange={set("name")} data-testid="input-name" />
                </div>
                <div className="sm:col-span-1">
                  <input className={inputCls} type="email" placeholder="Email address" value={form.email} onChange={set("email")} data-testid="input-email" />
                </div>
                <div className="sm:col-span-1">
                  <input className={inputCls} placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} data-testid="input-phone" />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-jb text-xs uppercase tracking-widest text-muted-foreground">Services you need — select one or more</span>
                    {services.length > 0 && (
                      <span className="font-jb text-xs text-primary" data-testid="services-count">{services.length} selected</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1" data-testid="service-selector">
                    {FORM_SERVICES.map((s, i) => {
                      const active = services.includes(s);
                      return (
                        <motion.button
                          type="button"
                          key={s}
                          onClick={() => toggleService(s)}
                          whileTap={{ scale: 0.94 }}
                          data-testid={`service-pill-${i}`}
                          aria-pressed={active}
                          className={`font-jb text-xs rounded-full px-3.5 py-2 border transition-colors duration-300 ${active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"}`}
                        >
                          {s}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <textarea rows={4} className={`${inputCls} resize-none`} placeholder="Tell us about your project" value={form.message} onChange={set("message")} data-testid="input-message" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto" data-testid="contact-submit">
                    {loading ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <>Send Requirements <ArrowUpRight size={18} /></>}
                  </button>
                  <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock size={13} className="text-primary" /> Opens WhatsApp to send your details securely. Your info stays private and is never shared.
                  </p>
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
