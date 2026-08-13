# Techy Potato — Premium Agency Website

## Original Problem Statement
Build a world-class, premium, futuristic single-page marketing website for the digital marketing & technology agency "Techy Potato" with the slogan "YOUR VISION. OUR TECH." Award-worthy (Awwwards-level), mobile-first, conversion-focused, with kinetic hero, smooth momentum scroll, scroll-reveals and micro-interactions.

## Architecture
- **Frontend**: React 19 + Tailwind, framer-motion (reveals/micro-interactions), lenis (smooth scroll). Section components in `src/components/site/`, content in `src/data.js`, animation helpers in `src/lib/anim.jsx`.
- **Backend**: FastAPI + MongoDB. `POST /api/contact` (save lead), `GET /api/contact` (list leads). Lead model with EmailStr validation.
- **Design**: Dark neo-brutalist, electric neon-yellow (#D9F844) accent, Cabinet Grotesk / Inter / JetBrains Mono. Grain overlay, glass navbar.

## User Personas
- Business owners / brands / creators seeking digital services (websites, apps, AI, branding, marketing).

## Core Requirements (static)
- Hero with masked line-by-line reveal + slogan; sticky glass nav w/ smooth scroll; About + animated stats; 14 Services; Why Us; Portfolio; Process; Testimonials; Pricing; FAQ; Contact (form + Google Map + socials); Footer (quick links, privacy, terms, copyright).

## Implemented (2026-08-13)
- All sections built and live; kinetic hero, parallax, marquee, counters, magnetic CTA, FAQ accordion.
- Working contact form persisting leads to MongoDB with validation + toasts.
- Real contact details wired: phone +91 79736 96769, Instagram, Facebook, WhatsApp.
- Backend 5/5 pytest + full frontend flows tested 100% pass.

## Backlog / Remaining
- P1: Email notification on new lead (Resend integration) — currently leads only saved to DB.
- P2: Real Privacy Policy / Terms pages (currently placeholder anchors).
- P2: Replace placeholder projects/testimonials with real case studies.

## Next Tasks
- Add email-on-lead via Resend; build Privacy/Terms pages; swap in real portfolio content.
