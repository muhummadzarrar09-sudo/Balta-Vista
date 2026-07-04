# Balta Vista Nathiagali — Prototype Roadmap

This roadmap treats the hotel website as our own product, not a one-off template. The goal is to move from the current build into a sharper Alpha Prototype, then a more realistic Beta Prototype, then a finished launch-ready product.

## Product Vision

Balta Vista should feel like a luxury mountain hotel brand before the physical property is fully available for photography and drone footage.

The site should do three jobs:

1. **Seduce** — create a cinematic first impression rooted in Nathiagali, pine forest, weather, warmth, and quiet.
2. **Convince** — make rooms, location, architecture, owner story, and trust feel credible.
3. **Convert** — guide guests into a full-rate inquiry without fake payments, overbuilt auth, or confusing deposit logic.

## Design Principles

- Luxury through restraint, not decoration.
- Homepage seduces; sub-pages convince.
- Motion should feel choreographed, not scattered.
- Brass is an accent, not a default color.
- Real-world hospitality language beats internal MVP language.
- Generated imagery is acceptable only until real drone, render, and photography assets arrive.
- Booking should feel like a reservations desk, not a SaaS form.
- Location and road clarity are conversion features for Nathiagali.
- No pure white. No Framer Motion. GSAP remains the motion engine.

---

# Current State

The project currently has:

- Cinematic homepage
- Dedicated pages:
  - `/rooms`
  - `/experience`
  - `/location`
  - `/design`
  - `/booking`
  - `/reviews`
- Booking API with validation, sanitization, rate limiting, optional webhook
- Event API with optional analytics webhook
- Security headers and HTTPS proxy behavior
- Branded 404/error/loading states
- OpenGraph/Twitter images
- Brochure asset
- Organized docs and assets

This is now beyond a raw MVP. The next goal is to make it a coherent Alpha Prototype.

---

# Alpha Prototype

## Alpha Goal

Turn the current build into a polished internal/client prototype that feels intentionally designed end-to-end, even though real property assets are not final yet.

Alpha is not about adding lots of features. Alpha is about tightening the experience, eliminating cheap tells, and making the current placeholder state feel deliberate.

## Alpha Success Criteria

- Homepage feels concise, premium, and confident.
- All sub-pages feel like part of the same brand system.
- No public-facing copy sounds like a dev note or MVP disclaimer.
- Booking route feels concierge-led.
- Rooms page helps users choose a tier clearly.
- Design page feels like an architecture studio board.
- Motion feels consistent and reduced-motion safe.
- Site builds cleanly with no audit issues.

## Alpha Phase A — Homepage Final Edit

### Goal
Make the homepage feel like a true luxury hotel homepage, not a full pitch deck.

### Work
- Review current homepage order:
  1. Hero
  2. Architecture teaser
  3. Rooms pinned teaser
  4. Experience teaser
  5. Trust / Owner Story
  6. Booking teaser
  7. Location teaser
  8. Footer
- Remove anything that repeats too much from sub-pages.
- Make homepage CTAs route users deeper instead of explaining everything inline.
- Ensure each homepage section has one clear job.

### Acceptance Criteria
- Homepage can be skimmed in under 90 seconds.
- Every section has a clear next action.
- No section feels like filler.

## Alpha Phase B — Public Copy Polish

### Status
Complete — public-facing copy has been reviewed and softened. Remaining terms like code comments, CSS `placeholder` selectors, and local asset filenames are not visible guest-facing copy.

### Goal
Remove all remaining internal/product language from public pages.

### Work
- Audit pages for phrases like:
  - MVP
  - placeholder
  - preview reviews
  - Google-ready
  - real founder portrait
  - fake checkout
- Replace with guest-facing language:
  - opening-season inquiry
  - architectural studies
  - verified guest feedback after opening
  - reservations desk
- Tighten all CTAs.

### Acceptance Criteria
- Public pages read like a real hotel brand.
- Docs can remain technical, but frontend cannot sound like a build note.

## Alpha Phase C — Visual Rhythm Pass

### Status
Complete — homepage and subpage section spacing has been normalized now that detail has moved into dedicated routes.

### Goal
Improve pacing between sections and pages.

### Work
- Check vertical spacing on homepage and all sub-pages.
- Reduce any section that feels too dense.
- Make section starts feel intentional.
- Ensure large imagery and text blocks alternate naturally.
- Confirm mobile stacking remains elegant.

### Acceptance Criteria
- Pages do not feel like stacked components.
- There is enough negative space for luxury pacing.
- Mobile does not feel cramped.

## Alpha Phase D — Motion QA Pass

### Status
Complete — motion cleanup, image-load refresh handling, SplitType cleanup, and reduced-motion behavior have been reviewed.

### Goal
Make motion feel designed, not template-like.

### Work
- Verify hero reveal after loader.
- Verify pinned rooms release cleanly.
- Verify image wipe reveals are not overused.
- Confirm card staggers are section-local.
- Confirm nav indicator moves only on section/page state changes.
- Confirm reduced-motion users get static visible content.

### Acceptance Criteria
- Motion has hierarchy.
- No jank in pinned rooms.
- No hidden content in reduced-motion mode.

## Alpha Phase E — Rooms / Booking Conversion Polish

### Status
Complete — room best-for guidance, comparison content, concierge booking framing, and room-specific booking preselection have been added.

### Goal
Make room choice and booking inquiry flow feel commercially useful.

### Work
- Review `/rooms` best-for language.
- Review comparison section.
- Add any missing room decision cues.
- Review `/booking` reservations desk panel.
- Clarify what happens after inquiry submission.

### Acceptance Criteria
- Guest can decide which room tier fits them.
- Booking feels like a luxury reservations workflow, not a generic form.

## Alpha Phase F — QA + Alpha Signoff

### Status
Complete — Alpha signoff documentation has been created and the build has passed production checks.

### Goal
Prepare a stable Alpha build.

### Work
- Run full checks:
  - `npm run check`
  - route smoke tests
  - asset reference checks
  - env/docs consistency checks
- Update feature-status docs.
- Prepare Alpha handoff notes.

### Acceptance Criteria
- Typecheck passes.
- Build passes.
- Audit passes.
- No-white guard passes.
- Known limitations documented.

---

# Beta Prototype

## Beta Goal
Turn the Alpha into a more realistic external-facing prototype with production-like content, better data integration hooks, and stronger launch confidence.

Beta should be shareable with stakeholders, early partners, and possibly selected guests.

## Beta Success Criteria

- Real or client-approved imagery begins replacing generated placeholders.
- Sub-pages are richer and more SEO-ready.
- Booking inquiry can route to a real workflow.
- Analytics events can route to a real reporting endpoint.
- Reviews page does not imply fake reviews.
- Location route is tied to real map details if available.

## Beta Phase A — Asset Replacement Round 1

### Status
Asset intake ready — stable replacement slots and art-direction requirements are documented in [`../assets/beta-asset-manifest.md`](../assets/beta-asset-manifest.md). Actual visual replacement requires client-supplied or approved assets.

### Goal
Replace the most obvious generated placeholders.

### Priority Asset Order
1. Hero exterior / drone / architectural render
2. Signature Suite
3. Double Bedroom
4. Single Bedroom
5. Bonfire / exterior atmosphere
6. Owner or lobby story image

### Acceptance Criteria
- Hero image feels plausible and property-specific.
- Room images no longer feel generic or AI-heavy.
- Imagery has consistent warm grading.

## Beta Phase B — Google Map / Location Upgrade

### Status
Live-map ready — `/location` now supports `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` and keeps a branded fallback route if no confirmed map URL is configured. See [`../assets/location-map-config.md`](../assets/location-map-config.md).

### Goal
Move from illustrative route placeholder toward real route confidence.

### Work
- Add final Google Maps embed URL.
- Confirm exact property pin.
- Add road/weather advisory copy.
- Add travel time caveat.
- Maintain branded gold route moment if possible.

### Acceptance Criteria
- Location page helps guests plan actual travel.
- No default cold/blue map treatment dominates the design.

## Beta Phase C — Booking Workflow Integration

### Status
Webhook-ready — booking lead delivery supports an optional server-side webhook plus optional HMAC signing via `BOOKING_WEBHOOK_SECRET`. See [`../launch/booking-webhook.md`](../launch/booking-webhook.md).

### Goal
Connect real lead delivery.

### Work
- Configure `BOOKING_WEBHOOK_URL`.
- Test Zapier/Make/CRM delivery.
- Confirm webhook payload shape.
- Add operational notifications if needed.
- Decide whether inquiries go to email, Sheets, CRM, or WhatsApp workflow.

### Acceptance Criteria
- Valid booking inquiry reaches the team.
- User receives a reference.
- No personal data is exposed in client response.

## Beta Phase D — Analytics Integration

### Status
Webhook-ready — first-party conversion events can forward to `ANALYTICS_WEBHOOK_URL` with optional HMAC signing via `ANALYTICS_WEBHOOK_SECRET`. See [`../analytics/events.md`](../analytics/events.md).

### Goal
Track meaningful conversion behavior without heavy third-party scripts.

### Work
- Configure `ANALYTICS_WEBHOOK_URL`.
- Track:
  - hero CTA clicks
  - booking starts
  - booking successes
  - WhatsApp clicks
  - room page CTA clicks
  - reviews clicks
- Build simple reporting destination.

### Acceptance Criteria
- Team can see core conversion signals.
- No privacy-invasive third-party scripts required.

## Beta Phase E — Reviews / Trust Reframe

### Status
Complete — `/reviews` has been reframed as a Guest Confidence page with no simulated review cards or aggregate-rating schema until verified guest feedback exists.

### Goal
Make trust credible before real reviews exist.

### Work
- Reframe `/reviews` as guest confidence or opening trust page if no real reviews exist.
- If real Google reviews exist, connect them.
- Remove any review copy that could be mistaken as fake operational data.

### Acceptance Criteria
- Trust page is honest.
- No fake review risk.
- Ready to plug in real reviews later.

## Beta Phase F — SEO Content Pass

### Status
Complete — route metadata already exists and structured JSON-LD helpers have been added for rooms, booking, experience, location, and design pages.

### Goal
Make pages useful for search and sharing.

### Work
- Improve metadata for each route.
- Add richer page copy for:
  - rooms
  - Nathiagali experience
  - location from Islamabad/Rawalpindi
  - luxury hotel positioning
- Ensure sitemap is complete.
- Review OpenGraph images.

### Acceptance Criteria
- Every route has a unique SEO purpose.
- Metadata is not duplicated.
- Site is ready for indexed preview if desired.

## Beta Phase G — Cross-Browser / Device QA

### Status
Automated QA ready — static and runtime smoke scripts have been added via `npm run qa:beta`; manual real-device QA remains pending. See [`../qa/beta-device-qa.md`](../qa/beta-device-qa.md).

### Goal
Make sure the site works outside the local dev environment.

### Devices / Browsers
- iOS Safari
- Android Chrome
- Desktop Chrome
- Desktop Safari
- Firefox
- Edge

### Acceptance Criteria
- Nav works.
- Pinned rooms works or degrades acceptably.
- Booking works.
- Images render crisply.
- No layout overflow.
- Reduced motion works.

---

# Finished Product

## Finished Product Goal
Launch a real luxury hotel website ready for public traffic, real guests, real inquiry handling, and future payments.

## Finished Success Criteria

- Final brand imagery is real or fully approved.
- Copy is guest-facing and operationally accurate.
- Booking workflow is connected and monitored.
- Site is deployed on production domain with HTTPS.
- Analytics and lead delivery are live.
- Performance is acceptable on mobile.
- No fake reviews or misleading operational claims.
- Security posture is documented.

## Final Phase A — Final Art Direction

### Status
Readiness complete — final art-direction standards and asset QA are documented in [`../art-direction/final-art-direction.md`](../art-direction/final-art-direction.md). Actual replacement remains pending real/client-approved imagery.

### Work
- Replace all remaining generated images.
- Add final drone footage or video hero if available.
- Apply consistent warm color grade.
- Add final architecture renders.
- Add real owner/property imagery.

### Acceptance Criteria
- Site no longer reads as AI-generated.
- Every major image is approved by the client.

## Final Phase B — Final Content + Operations Alignment

### Work
- Confirm final rates.
- Confirm check-in/check-out.
- Confirm inclusions.
- Confirm room capacity.
- Confirm road guidance.
- Confirm cancellation policy.
- Confirm parking.
- Confirm WhatsApp/phone/email.

### Acceptance Criteria
- No placeholder operational claims remain.
- Team agrees with all public-facing copy.

## Final Phase C — Production Booking System

### Work
- Keep inquiry-only if that is still the business model, or:
- Add hosted payment via Stripe Checkout if payment is required.
- Do not handle raw card data.
- Add database only if persistent booking records are required.
- Add Supabase/Postgres + RLS only if accounts or protected booking records exist.

### Acceptance Criteria
- Booking flow matches real operations.
- Payment, if added, is hosted and secure.

## Final Phase D — Performance Optimization

### Work
- Optimize image formats.
- Add responsive image variants if needed.
- Review JS bundle weight.
- Review Lenis/GSAP impact.
- Lazy-load non-critical sections.
- Test on slower mobile connections.

### Acceptance Criteria
- Hero loads acceptably.
- Mobile scroll is smooth.
- No massive unnecessary assets.

## Final Phase E — Accessibility + Legal

### Work
- Keyboard QA.
- Screen reader pass.
- Focus states.
- Reduced motion.
- Add privacy policy if analytics/lead collection are live.
- Add terms/cancellation if booking operations require it.

### Acceptance Criteria
- Keyboard users can complete key flows.
- Reduced motion works.
- Required policies exist.

## Final Phase F — Launch QA

### Work
- Production smoke test.
- Booking webhook test.
- Analytics event test.
- Sitemap/robots check.
- OpenGraph preview check.
- 404/error route check.
- Mobile QA.

### Acceptance Criteria
- Launch checklist passes.
- Stakeholders approve.
- Domain goes live.

---

# Suggested Execution Order From Here

## Immediate Next Work

1. Alpha Phase A — homepage final edit check
2. Alpha Phase B — copy polish verification
3. Alpha Phase C — visual rhythm pass
4. Alpha Phase D — motion QA pass
5. Alpha Phase E — rooms/booking polish
6. Alpha Phase F — Alpha signoff

## Then

Move to Beta only when client supplies or approves stronger assets, especially hero and room imagery.

## Final Note

See [`alpha-signoff.md`](alpha-signoff.md) for Alpha completion notes.

Next recommended stage: **Beta Phase A — Asset Replacement Round 1**.
