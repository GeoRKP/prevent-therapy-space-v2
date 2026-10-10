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

`app/globals.css` defines the light/dark palettes via HSL CSS variables under `:root` and `.dark`. Tokens map to Tailwind via `@theme` (`bg-background`, `text-primary`, `bg-card`, etc.). Dark mode is class-based (`.dark` on `<html>`). A toggle is **not yet wired** — add `next-themes` and a button in the header when needed.

**Design system (redesign, October 2026).** Same identity — navy on desktop, «Φασκόμηλο» sage on mobile, mint `primary-soft` accent, forest `primary` for the booking band — with a reworked type and layout language. Typography: **Literata** for headings (weights 450–500, never bold) and **Commissioner** for text and UI, loaded in `app/layout.jsx`; one scale in `app/globals.css` (`t-display`, `t-h1`…`t-h4`, `t-lead`, `t-body` 17px, `t-small`, `t-caption`) — use these classes, not ad-hoc `text-3xl font-bold`. Tailwind's `white` is redefined as warm ivory `#f2ede4`, so every `text-white/NN`, `border-white/NN` and `bg-white` is warm by design. Rules: no uppercase "eyebrow" labels above headings (`SectionHeading` puts the title left and the intro right, `layout="stack"|"center"` for the other cases); real photos are shown clean (no dimming overlays — only short gradients where text or controls sit on a photo); content is grouped with hairlines (`border-white/12`) instead of a card per item — cards are kept for things that are objects (partner profiles, the booking calendar, the contact form); body text sits at `text-white/65–75`. Motion is limited to the hero entrance/slide crossfade and the one signature moment: the "treatment path" line in `HowItWorks`, drawn once when it scrolls into view (no numbers — the client removed numbering from services, the path and the goals; it stays on the hero slides, the conditions list and the FAQ). Mobile keeps the earlier conventions: the hero photo is a clean 4:3 card above the title, the home is shortened (services as rows with a thumbnail, reviews as a snap carousel, no second photo in "Our tools", six gallery photos), body-text opacity is raised by the `@media (max-width: 991.98px)` block in `app/globals.css`. Between 992 and 1279px the hero photo starts below the header, because the menu doesn't fit next to it. Screenshots for review: Playwright's cached headless shell (see the git history of this paragraph), desktop 1440 and mobile 390.

**Mobile palette «Φασκόμηλο» (sage).** Below 992px every dark surface is a warm dark green instead of navy, chosen by the client in September 2026 (navy turned visibly blue once lifted into cards). Components keep their navy hex classes, which are the desktop colours; the block «ΚΙΝΗΤΟ / TABLET — ΠΑΛΕΤΑ ΦΑΣΚΟΜΗΛΟ» in `app/globals.css` remaps them under the media query (`#050810 → #0c100f`, `#070b14 → #131917`, `#0a0f1a → #1a2220`, `#040609 → #080b0a`, gradients included) and defines the mobile-only `m-card` / `m-section-alt` classes. A new navy utility in a component (another opacity, another gradient stop) must be added to that block, or it stays navy on phones.

**Form validation.** The contact and booking forms use `noValidate` and one shared rule set, `lib/form-validation.js`, on both sides: the page shows the reason under each field (`components/common/FormField.jsx`, `lib/use-form-validation.js`: after the field is left, then live while it is corrected) and the API routes run the same functions and return `400 { error: "validation", fields: { phone: { code, params } } }`. Messages live in `common:validation.*` (el/en) and say what exactly is wrong, e.g. how many digits a Greek number is missing (10 digits, 69… mobile or 2… landline, optional +30/0030; numbers abroad need + and 8–15 digits) or that an email was typed with a Greek keyboard. The contact phone is optional; the booking phone is required.

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

- Theme toggle (dark mode is reachable only by manually adding `.dark` to `<html>`).

## Origin

Forked structurally from the `frena` (Frena Rigas) project. Bootstrap and many decorative animation libraries (rellax, isotope-layout, plyr, photoswipe, glightbox, swiper) are kept in dependencies but **not used** by the physio components — safe to prune later with `npm uninstall`.

