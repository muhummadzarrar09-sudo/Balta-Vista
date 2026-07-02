# Deployment Handoff — Pine & Peak Nathiagali MVP

## Recommended platform

Vercel is the simplest deployment target for this MVP because it provides HTTPS, Next.js App Router support, static asset hosting, route handlers, and edge image generation by default.

## Environment variables

Create these in the deployment dashboard:

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

Notes:

- `NEXT_PUBLIC_SITE_URL` should be the final production domain, no trailing slash.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` should be digits only, country code included.
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` can remain empty until the styled map is ready.
- reCAPTCHA is reserved for a later anti-spam upgrade; honeypot + rate limiting are already present.
- `BOOKING_WEBHOOK_URL` is optional and server-only. Use it for Zapier, Make, a CRM endpoint, or a private lead intake endpoint.
- `ANALYTICS_WEBHOOK_URL` is optional and server-only. Use it to forward privacy-light conversion events to an analytics or automation endpoint.
- `FORCE_HTTPS=true` can be enabled on non-Vercel hosts that need app-level HTTPS redirects. Vercel already serves HTTPS by default.

## Build commands

```bash
npm install
npm run check
```

For Bun locally:

```bash
bun install
bun run dev
```

## Production checks

`npm run check` runs:

1. TypeScript check
2. Next production build
3. npm audit at moderate level
4. no-pure-white source guard

## Generated routes

Expected route output includes:

- `/`
- `/reviews`
- `/api/booking`
- `/api/health`
- `/opengraph-image`
- `/twitter-image`
- `/robots.txt`
- `/sitemap.xml`
- `/manifest.webmanifest`

## Security posture

- HTTPS enforced in production via `proxy.ts` and platform defaults.
- Security headers configured in `next.config.ts`.
- Booking endpoint validates, sanitizes, origin-checks, body-size-checks, honeypot-checks, and rate-limits.
- No auth, accounts, deposits, card handling, or database storage are included in Phase 1.

## Phase 2 recommendations

- Add Stripe Checkout or another hosted checkout provider if real payment is required.
- Add Supabase/Postgres + RLS only if user accounts or persistent booking records are introduced.
- Connect reviews to Google Places or a CMS once operational reviews exist.
- Replace generated placeholders with real drone footage, Blender renders, and photography.
