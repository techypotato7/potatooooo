import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CONTACT } from "@/data";

const PRIVACY = [
  ["Overview", "Techy Potato (\"we\", \"us\") respects your privacy. This policy explains what information we collect, how we use it, and the choices you have. By using this website you agree to the practices described here."],
  ["Information We Collect", "When you submit our contact form we collect the details you provide — your name, email address, phone number, selected service and message. We may also collect basic, anonymous usage data (such as pages visited) to improve the site."],
  ["How We Use Your Information", "We use your information solely to respond to your enquiry, recommend the best solution for your business, and provide the services you request. We do not sell your personal data to third parties."],
  ["Data Security", "This website is served over a secure HTTPS (SSL) connection. Your submissions are transmitted securely and stored with reasonable technical safeguards to protect against unauthorised access."],
  ["Third-Party Links", "Our site links to external platforms such as Instagram, Facebook and WhatsApp. We are not responsible for the privacy practices of those services; please review their policies separately."],
  ["Your Rights", "You may request access to, correction of, or deletion of the personal data you have shared with us at any time by emailing " + CONTACT.email + "."],
  ["Contact", "For any privacy questions, reach us at " + CONTACT.email + " or " + CONTACT.phone + "."],
];

const TERMS = [
  ["Acceptance of Terms", "By accessing this website you agree to be bound by these Terms of Service. If you do not agree, please do not use the site."],
  ["Services", "Techy Potato provides digital marketing and technology services including websites, mobile apps, AI solutions, branding, design and growth marketing. Specific scope, deliverables and timelines are agreed per project."],
  ["Intellectual Property", "All content on this website — including the Techy Potato name, logo, text, graphics and design — is owned by Techy Potato and may not be reproduced without written permission."],
  ["Enquiries & Quotes", "Submitting the contact form does not create a binding contract. Pricing and consultation are provided after we understand your requirements."],
  ["Limitation of Liability", "The website and its content are provided \"as is\". To the fullest extent permitted by law, Techy Potato is not liable for any indirect or consequential damages arising from use of the site."],
  ["Changes", "We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the revised terms."],
  ["Contact", "Questions about these terms? Email " + CONTACT.email + "."],
];

export default function LegalModal() {
  const [type, setType] = useState(null);

  useEffect(() => {
    const handler = (e) => setType(e.detail);
    window.addEventListener("open-legal", handler);
    return () => window.removeEventListener("open-legal", handler);
  }, []);

  useEffect(() => {
    if (window.__lenis) {
      if (type) window.__lenis.stop();
      else window.__lenis.start();
    }
  }, [type]);

  const isPrivacy = type === "privacy";
  const sections = isPrivacy ? PRIVACY : TERMS;

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setType(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          data-testid="legal-modal"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-background border border-border rounded-md p-8 md:p-10"
          >
            <button
              onClick={() => setType(null)}
              data-testid="legal-close"
              className="absolute top-5 right-5 h-10 w-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <span className="overline">Legal</span>
            <h2 className="mt-4 font-display font-black text-3xl md:text-4xl tracking-tighter">
              {isPrivacy ? "Privacy Policy" : "Terms of Service"}
            </h2>
            <p className="mt-2 font-jb text-xs text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
            <div className="mt-8 space-y-6">
              {sections.map(([title, body]) => (
                <div key={title}>
                  <h3 className="font-display font-bold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
