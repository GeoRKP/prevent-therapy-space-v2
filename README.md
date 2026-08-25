# PREVENT Therapy Space

Physiotherapy clinic website built on the frena project structure.
Next.js 15 + React 18 + JavaScript + Tailwind v4 + Bootstrap (legacy) + react-i18next.

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET, RESEND_API_KEY, etc.

npm run google:setup   # one-time: sign in with the clinic's Google account
                       # → writes GOOGLE_REFRESH_TOKEN to .env.local

npm run dev
```

There is **no database** — bookings live entirely in the physiotherapist's Google Calendar, and the contact form forwards messages by email (Resend).

## Structure

- `app/` — Next.js App Router (JSX). Route groups: `(about)`, `(contact)`, `(services)`. Top-level: `booking/`, `faq/`, `api/`, `not-found.jsx`, `sitemap.xml/`.
- `components/headers/Header1.jsx` — main navigation.
- `components/physio/*` — page sections (Hero, ServicesGrid, HowItWorks, WhyChooseUs, TeamPreview, ConditionsSection, CtaSection, PhysioFooter, MotionWrapper, SectionHeading).
- `components/common/*` — HeadManager (per-page meta), LanguageDetector, StructuredData.
- `components/ui/*` — Radix-based primitives (button, input, etc.) + LanguageSwitcher.
- `data/services.js`, `data/team.js`, `data/conditions.js` — static service/team/condition definitions.
- `lib/i18n.js` — i18next setup (el + en).
- `lib/google-calendar.js` — minimal Google Calendar v3 REST client (freeBusy + event insert, refresh-token auth, no SDK dependency).
- `lib/booking.js` — slot generation from working hours, timezone math (Europe/Athens), availability + conflict checks.
- `data/booking.js` — booking settings the physiotherapist edits: appointment duration (default 45'), working hours per weekday, min notice, booking window. Env overrides: `BOOKING_DURATION_MINUTES`, `BOOKING_MIN_NOTICE_HOURS`, `BOOKING_MAX_ADVANCE_DAYS`.
- `scripts/google-setup.mjs` — one-time OAuth flow (`npm run google:setup`) that stores the clinic's `GOOGLE_REFRESH_TOKEN`.
- `public/locales/{el,en}/*.json` — translation namespaces (common, header, home, services, about, contact, footer, notfound, booking, faq).
- `public/images/` — physiotherapy assets (logo, team photos, clinic, etc.).

## Theming

`app/globals.css` defines the light/dark palettes via HSL CSS variables under `:root` and `.dark`. Tokens map to Tailwind via `@theme` (`bg-background`, `text-primary`, `bg-card`, etc.). Dark mode is class-based (`.dark` on `<html>`). A toggle is **not yet wired** — add `next-themes` and a button in the header when needed.

## Pages

- `/` — home (hero, services preview, how it works, why us, team, conditions, CTA).
- `/services` — full services list + conditions.
- `/about` — clinic philosophy + team.
- `/contact` — contact form + clinic info.
- `/booking` — 2-step booking flow (real availability → details) → POSTs to `/api/booking`.
- `/faq` — searchable FAQ.

## API

- `GET /api/booking/availability` — available slots for the whole booking window, computed as working hours minus the calendar's busy intervals (single freeBusy call).
- `POST /api/booking` — validates the slot (Zod + working hours + re-checked freeBusy), then inserts the event into the clinic's Google Calendar with the patient as attendee (`sendUpdates=all`, so Google emails the confirmation/invite — no extra email service needed).
- `POST /api/contact` — forwards the message to `CONTACT_EMAIL` via Resend (validated with Zod).

## Booking system

No database: Google Calendar is the single source of truth. The physiotherapist registers **once** with `npm run google:setup` (OAuth consent → refresh token in `.env.local` / production env vars). Configuration lives in `data/booking.js` (45-minute appointments by default, working hours per weekday, 2h min notice, 30-day window). Double-booking is prevented by re-checking freeBusy at booking time and returning `409 slot_taken`.

## What's NOT implemented yet

- Theme toggle (dark mode is reachable only by manually adding `.dark` to `<html>`).
- Privacy/Terms static pages.
- Sitemap and Open Graph image fine-tuning.

## Origin

Forked structurally from the `frena` (Frena Rigas) project. Bootstrap and many decorative animation libraries (rellax, isotope-layout, plyr, photoswipe, glightbox, swiper) are kept in dependencies but **not used** by the physio components — safe to prune later with `npm uninstall`.

