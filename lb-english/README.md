# L.B. English Co. — Website

Professional, conversion-focused website for **L.B. English Co.** — a native teacher platform (12+ years worldwide) offering IELTS / TOEFL / SAT / ESL / Business English / Speaking Clubs.

## Features
- **Trust-first design** — navy/cream/gold palette, Fraunces + Instrument Sans, generous whitespace
- **Easy navigation** — sticky header, mobile drawer, smooth scroll, section-anchored
- **Business goals:**
  - Lead capture (free 20-min consult booking form)
  - Free resources with email gated download
  - Premium memberships: Starter (Free) / Scholar £29 / Elite £79 with monthly/yearly toggle
  - Speaking Clubs (drop-in £9, 4-pack £29, free with Elite)
  - 1:1 Consultancy (£49, credited)
- **Social proof** — stats, testimonials, guarantees, trust strip
- **Subtle animations** — IntersectionObserver reveals, hover lifts, counter anim, toast system
- **Optimized** — no framework, ~70KB total, system fonts fallback, lazy-friendly images, semantic HTML, accessible dialogs

## Run locally
```powershell
# PowerShell
python -m http.server 8000 --directory lb-english
# then open http://localhost:8000
```
Or just double-click `index.html`.

## Structure
- `index.html` — single-page, SEO meta, OG-ready
- `style.css` — design system, responsive (mobile-first)
- `script.js` — nav, reveals, pricing toggle, modals, forms (demo toasts)

## Customize
- Update contact in `.topbar` and `#contact`
- Replace Unsplash images & pravatar placeholders with real photos
- Connect `handleBooking` / `handleLead` to your backend / Mailchimp / Calendly
- Replace `showToast` checkout demo with Stripe Checkout link

© 2026 L.B. English Co.
