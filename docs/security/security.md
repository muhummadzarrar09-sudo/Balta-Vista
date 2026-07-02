# MVP Security Notes

This project intentionally avoids auth, accounts, payment collection, and persistent customer records in Phase 1.

## Implemented now

- Server-side zod validation for booking inquiries.
- Client-side react-hook-form validation for UX.
- Honeypot field to deflect simple bots.
- In-memory API rate limiting for the booking endpoint.
- Same-origin request check for booking POSTs.
- Request body size cap.
- Basic string sanitization before any downstream processing.
- Security headers in `next.config.ts`:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
- Secrets/API keys represented via environment variables, not hardcoded.

## Not implemented by design

- No login/user accounts.
- No payment/deposit logic.
- No Postgres/Supabase storage.
- No RLS policies, because there are no user-scoped database records yet.

## Phase 2 recommendation

When real payments are added, use Stripe Checkout or another hosted checkout flow so the site never directly handles card data. If accounts or persistent booking records are introduced, add Supabase/Postgres with RLS at that time.
