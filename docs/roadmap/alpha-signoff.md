# Alpha Prototype Signoff — Balta Vista Nathiagali

## Alpha Status

Alpha Prototype is complete.

The project has moved from a single-page MVP-style presentation into a multi-route luxury hotel prototype with a clearer homepage, richer sub-pages, cleaner brand language, improved motion handling, and stronger conversion paths.

## Completed Alpha Phases

1. **Homepage Final Edit** — homepage reduced to seduce, hint, and guide deeper.
2. **Public Copy Polish** — internal/MVP language removed from guest-facing surfaces.
3. **Visual Rhythm Pass** — homepage/subpage spacing normalized.
4. **Motion QA Pass** — motion cleanup, reduced-motion handling, image-load refresh, and SplitType cleanup improved.
5. **Rooms / Booking Conversion Polish** — room best-for guidance, comparison content, concierge booking framing, and room-specific booking preselection added.
6. **Alpha Signoff** — final checks and limitations documented.

## Current Routes

- `/`
- `/rooms`
- `/booking`
- `/experience`
- `/location`
- `/design`
- `/reviews`
- `/api/booking`
- `/api/events`
- `/api/health`
- `/robots.txt`
- `/sitemap.xml`
- `/manifest.webmanifest`
- `/opengraph-image`
- `/twitter-image`

## What Alpha Proves

- Balta Vista has a credible luxury direction.
- The homepage no longer feels overloaded.
- Sub-pages make the site feel like an actual hotel website.
- Booking feels more like a reservations desk than a generic form.
- Room tiers are easier to understand.
- Location and road context are treated as conversion features.
- Motion is GSAP-only and more stable.
- Reduced-motion users receive visible static content.
- Security/config posture is appropriate for an inquiry-only prototype.

## Known Alpha Limitations

These are not blockers for Alpha, but they should be addressed before Beta or final launch:

1. Imagery is still generated/art-directed, not real hotel photography or final renders.
2. Exact map pin and Google Maps styling are not final.
3. Reviews are structured for future verified feedback, not connected to live Google Places data.
4. Booking webhook and analytics webhook are optional and not connected unless env vars are set.
5. No payment/deposit logic exists by design.
6. No database/user accounts exist by design.
7. Device QA still needs to happen on real iOS Safari, Android Chrome, desktop Safari, Chrome, Firefox, and Edge.
8. Final operational details need client confirmation: rates, inclusions, check-in/out, cancellation, parking, road guidance.

## Alpha QA Commands

```bash
npm run check
```

This runs:

- TypeScript check
- Next production build
- npm audit at moderate level
- no-pure-white guard

## Alpha Result

Alpha is approved for Beta planning.

Next recommended stage: **Beta Phase A — Asset Replacement Round 1**.
