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

Bookings live entirely in the physiotherapist's Google Calendar; a tiny Neon Postgres table only stores the admin booking settings. The contact form and all booking emails go through Resend. Handover / pending items: see the Greek pending-items file in the repo root.

## Structure

- `app/` — Next.js App Router (JSX). Route groups: `(about)`, `(contact)`, `(services)`. Top-level: `booking/`, `faq/`, `api/`, `not-found.jsx`, `sitemap.xml/`.
- `components/headers/Header1.jsx` — main navigation.
- `components/physio/*` — page sections (Hero, ServicesGrid, HowItWorks, WhyChooseUs, TeamPreview, ConditionsSection, CtaSection, PhysioFooter, MotionWrapper, SectionHeading).
- `components/common/*` — AppShell (client shell: i18n, header/footer, toasts), HeadManager (client-side meta refresh on language change), LanguageDetector, StructuredData.
- `components/ui/*` — Radix-based primitives (button, input, etc.) + LanguageSwitcher.
- `data/services.js`, `data/team.js`, `data/conditions.js` — static service/team/condition definitions.
- `lib/i18n.js` — i18next setup (el + en).
- `lib/google-calendar.js` — minimal Google Calendar v3 REST client (freeBusy + event insert, refresh-token auth, no SDK dependency).
- `lib/google-auth.js` + `lib/google-oauth.js` — the clinic's Google connection: refresh token stored in Neon (`prevent_google_auth`, connected from `/admin` → Google Calendar tab) with `GOOGLE_REFRESH_TOKEN` as env fallback; OAuth state/CSRF + code exchange.
- `lib/db.js` — shared Neon pool; `lib/settings.js` — admin booking settings (`prevent_booking_settings`).
- `lib/booking.js` — slot generation from working hours, timezone math (Europe/Athens), availability + conflict checks.
- `data/booking.js` — booking settings the physiotherapist edits: appointment duration (default 45'), working hours per weekday, min notice, booking window. Env overrides: `BOOKING_DURATION_MINUTES`, `BOOKING_MIN_NOTICE_HOURS`, `BOOKING_MAX_ADVANCE_DAYS`.
- `scripts/google-setup.mjs` — one-time OAuth flow (`npm run google:setup`) that stores the clinic's `GOOGLE_REFRESH_TOKEN`.
- `public/locales/{el,en}/*.json` — translation namespaces (common, header, home, services, about, contact, footer, notfound, booking, faq).
- `public/images/` — physiotherapy assets (logo, team photos, clinic, etc.).

## Theming

`app/globals.css` defines the legacy shadcn-style HSL palettes under `:root` and `.dark` (`bg-background`, `text-primary`, `bg-card`, …); the `.dark` class is not used by the pages. The site's real theming is the `data-theme` system described next.

**Light / dark theme with a visitor toggle.** The theme is the `data-theme` attribute on `<html>` (`"light"` or `"dark"`), set before first paint by the inline `theme-init` script in `app/layout.jsx`: the visitor's stored choice (`localStorage["theme"]`), otherwise light below 992px (phones, tablets) and dark on desktop. `components/common/ThemeToggle.jsx` flips it and stores it; it sits in the header between Viber and the language switcher on desktop and next to the hamburger on mobile. Pure CSS otherwise: `@theme inline` tokens in `app/globals.css` (`bg-canvas`, `bg-canvas-1`, `bg-canvas-2`, `bg-canvas-deep`, `bg-dim`, `text-ink`, `text-ink-NN`, `bg-brand`, `text-brand-fg`) whose `:root` values equal the original dark hex/white/mint values, and a `:root[data-theme="light"] { … }` block that overrides them — to tune the light palette, edit only that block. Rules: never hardcode `#050810`-style hex, `text-white`, `border-white/…` or `primary-soft` in page components — use the tokens; keep `text-white`/`bg-white` only inside solid-colored blocks that must not flip (`bg-primary text-white` buttons, the green CTA card); use `bg-dim/NN` for a darkening overlay on a photo (it becomes transparent on light) and `from-canvas…` for a fade into the section background. `components/ui/*` (except the language switcher) and the `#343f52` button variants are not tokenized (unused by the pages).

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
- `GET /api/admin/google/connect` → Google consent → `GET /api/admin/google/callback` (stores the refresh token in Neon); `GET /api/admin/google/status`, `POST /api/admin/google/disconnect`. The OAuth client must list `https://www.preventtherapy.gr/api/admin/google/callback` as an authorized redirect URI.

## Booking system

Google Calendar is the single source of truth for appointments. The physiotherapist connects the clinic's Google account **once from `/admin` → Google Calendar** (the refresh token is stored in Neon; no redeploy needed). `npm run google:setup` remains as the local-development alternative (writes `GOOGLE_REFRESH_TOKEN` to `.env.local`). Configuration lives in `data/booking.js` (45-minute appointments by default, working hours per weekday, 2h min notice, 30-day window). Double-booking is prevented by re-checking freeBusy at booking time and returning `409 slot_taken`.

## SEO / metadata

`app/layout.jsx` is a **server component** (default metadata, JSON-LD) and every route folder has a `layout.jsx` exporting its own metadata via `lib/seo.js` — pages themselves stay client components. `lib/site.js` is the single source for the public URL (`NEXT_PUBLIC_SITE_URL`, production `https://www.preventtherapy.gr`). `components/common/HeadManager.jsx` only re-writes the same tags on the client when the visitor switches language.

## What's NOT implemented yet


## Origin

Forked structurally from the `frena` (Frena Rigas) project. Bootstrap and many decorative animation libraries (rellax, isotope-layout, plyr, photoswipe, glightbox, swiper) are kept in dependencies but **not used** by the physio components — safe to prune later with `npm uninstall`.

