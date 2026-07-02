# Phase 9 — Security & Config Hardening

This MVP still has no auth, no accounts, no deposit logic, and no payment collection. Security hardening is therefore focused on public marketing pages and the booking inquiry endpoint.

## Implemented in this phase

### Headers

Configured in `next.config.ts`:

- Content-Security-Policy
- Strict-Transport-Security in production
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy with camera/microphone/payment disabled
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy

The CSP removes `unsafe-eval` in production while allowing it only in development where Next tooling may need it.

### HTTPS enforcement

Added `proxy.ts` to redirect HTTP traffic to HTTPS in production when `x-forwarded-proto` is `http` and the app is running on Vercel or `FORCE_HTTPS=true`. This uses the latest Next.js proxy convention instead of the deprecated middleware filename. Vercel already serves HTTPS by default; the guard is explicit without breaking local production smoke tests.

### Environment validation

Added `lib/env.ts` with zod schemas for:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

### Reusable rate limiting

Added `lib/rate-limit.ts` and updated the booking endpoint to include standard rate-limit response headers:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

### Booking endpoint protections

The `/api/booking` endpoint now has:

- Same-origin check
- Body size cap
- zod server validation
- Sanitization
- Honeypot handling
- In-memory rate limiting
- No echoing of submitted personal details in the success response
- Optional server-side webhook forwarding via `BOOKING_WEBHOOK_URL`

## Explicitly out of scope

- No Supabase/Postgres/RLS yet because there are no user accounts or user-scoped database records.
- No auth layer because there is no login/account surface.
- No Stripe/payment/deposit logic yet because booking is an inquiry-only MVP.

## Phase 2 recommendation

When payments are added, use Stripe Checkout or another hosted checkout provider. Do not handle raw card data in this application. If accounts or persistent booking records are introduced, add Supabase/Postgres with RLS at that point.

## Verification command

```bash
npm run check
```
