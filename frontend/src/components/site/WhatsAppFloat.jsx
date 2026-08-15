import React from "react";
import { motion } from "framer-motion";
import { CONTACT } from "@/data";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float"
      aria-label="Chat with Techy Potato on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed z-50 bottom-5 right-5 md:bottom-7 md:right-7 flex items-center gap-3"
    >
      <span className="hidden md:block glass border border-white/10 rounded-full px-4 py-2 font-jb text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Chat with us
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-white" aria-hidden="true">
          <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3.2 28.8l6.58-1.72a12.72 12.72 0 0 0 6.22 1.6h.006c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.68-12.8-12.68zm0 23.04h-.004a10.6 10.6 0 0 1-5.4-1.48l-.386-.23-3.905 1.02 1.042-3.808-.252-.39a10.55 10.55 0 0 1-1.62-5.63c0-5.86 4.77-10.63 10.63-10.63 2.84 0 5.51 1.106 7.52 3.116a10.56 10.56 0 0 1 3.11 7.52c0 5.86-4.77 10.63-10.62 10.63zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.15-.15.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.64 0 1.55 1.14 3.05 1.3 3.26.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </span>
    </motion.a>
  );
}
