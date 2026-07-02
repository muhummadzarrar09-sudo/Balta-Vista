# Pine & Peak Nathiagali — Luxury Hotel MVP

A full-scale MVP marketing/booking website for a luxury hotel opening in Nathiagali, Pakistan.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4 token-driven styling
- GSAP + ScrollTrigger as the only animation engine
- Lenis smooth scroll synchronized with ScrollTrigger
- shadcn-style component primitives via Radix/CVA
- react-hook-form + zod validation
- next/image for local placeholder imagery
- SplitType heading reveals

## Run

```bash
bun install
bun run dev
```

If Bun is unavailable locally, npm also works:

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run build
npm run audit
```

Or run the combined production check:

```bash
npm run check
```

These pass in this workspace.

## Environment

Copy `.env.example` to `.env.local` and update values:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
BOOKING_WEBHOOK_URL=
ANALYTICS_WEBHOOK_URL=
FORCE_HTTPS=false
```

Google Maps and reCAPTCHA keys are intentionally not hardcoded.

## Security notes

- Booking API uses zod server validation and simple in-memory rate limiting.
- Honeypot field is included in the booking form.
- Security headers are configured in `next.config.ts`.
- HTTPS is expected at deploy on Vercel.
- No auth/user accounts exist in this MVP; Supabase/Postgres RLS is a Phase 2 concern only if accounts/persistent booking records/payments are introduced.
- Future payment work should use Stripe/hosted checkout to avoid handling card data directly.

## Project structure

See [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) for the organized folder map.

## Documentation

Detailed handoff docs now live in [`docs/`](docs/):

- [`docs/launch/deployment.md`](docs/launch/deployment.md)
- [`docs/launch/feature-status.md`](docs/launch/feature-status.md)
- [`docs/security/security.md`](docs/security/security.md)
- [`docs/security/phase-9-security-config.md`](docs/security/phase-9-security-config.md)
- [`docs/qa/quality-assurance.md`](docs/qa/quality-assurance.md)
- [`docs/analytics/events.md`](docs/analytics/events.md)

## Brochure

The secondary brochure deliverable lives outside the Next.js route tree:

`brochure/pine-peak-brochure.html`

Open it in a browser and print/export to PDF.
