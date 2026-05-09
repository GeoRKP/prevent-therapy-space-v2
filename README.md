# PREVENT Therapy Space

Physiotherapy clinic website built on the frena project structure.
Next.js 15 + React 18 + JavaScript + Tailwind v4 + Bootstrap (legacy) + react-i18next.

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in DATABASE_URL, RESEND_API_KEY, etc.

npx prisma generate
npx prisma db push   # or `db:migrate` for migrations

npm run dev
```

## Structure

- `app/` — Next.js App Router (JSX). Route groups: `(about)`, `(contact)`, `(services)`. Top-level: `booking/`, `faq/`, `api/`, `not-found.jsx`, `sitemap.xml/`.
- `components/headers/Header1.jsx` — main navigation.
- `components/physio/*` — page sections (Hero, ServicesGrid, HowItWorks, WhyChooseUs, TeamPreview, ConditionsSection, CtaSection, PhysioFooter, MotionWrapper, SectionHeading).
- `components/common/*` — HeadManager (per-page meta), LanguageDetector, StructuredData.
- `components/ui/*` — Radix-based primitives (button, input, etc.) + LanguageSwitcher.
- `data/services.js`, `data/team.js`, `data/conditions.js` — static service/team/condition definitions.
- `lib/i18n.js` — i18next setup (el + en).
- `lib/prisma.js` — Prisma client singleton.
- `prisma/schema.prisma` — DB schema (Service, Appointment, ContactMessage, WorkingHours, BlockedDate, BookingSettings).
- `public/locales/{el,en}/*.json` — translation namespaces (common, header, home, services, about, contact, footer, notfound, booking, faq).
- `public/images/` — physiotherapy assets (logo, team photos, clinic, etc.).

## Theming

`app/globals.css` defines the light/dark palettes via HSL CSS variables under `:root` and `.dark`. Tokens map to Tailwind via `@theme` (`bg-background`, `text-primary`, `bg-card`, etc.). Dark mode is class-based (`.dark` on `<html>`). A toggle is **not yet wired** — add `next-themes` and a button in the header when needed.

## Pages

- `/` — home (hero, services preview, how it works, why us, team, conditions, CTA).
- `/services` — full services list + conditions.
- `/about` — clinic philosophy + team.
- `/contact` — contact form + clinic info.
- `/booking` — 3-step booking flow → POSTs to `/api/booking`.
- `/faq` — searchable FAQ.

## API

- `POST /api/contact` — saves contact message (validated with Zod).
- `POST /api/booking` — creates an Appointment row.

Both routes save to the DB but do **not** send emails yet — Resend/Nodemailer integration is left as TODO comments inside each route.

## What's NOT implemented yet

- Theme toggle (dark mode is reachable only by manually adding `.dark` to `<html>`).
- Email sending (Resend/Nodemailer keys + actual `sendMail` calls).
- Admin panel and authentication (next-auth is installed but not configured).
- Full booking validation: time-slot availability check, working-hours enforcement, conflict detection.
- Privacy/Terms static pages.
- Sitemap and Open Graph image fine-tuning.
- A Prisma seed script.

## Origin

Forked structurally from the `frena` (Frena Rigas) project. Bootstrap and many decorative animation libraries (rellax, isotope-layout, plyr, photoswipe, glightbox, swiper) are kept in dependencies but **not used** by the physio components — safe to prune later with `npm uninstall`.
