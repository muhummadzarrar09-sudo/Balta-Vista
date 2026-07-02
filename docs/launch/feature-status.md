# Feature Status — Pine & Peak Nathiagali MVP

## Original requested build phases

All original phases have been implemented at MVP level.

1. Foundation — done
2. Navigation — done
3. Hero — done
4. Design Concepts — done
5. Rooms pinned scroll — done
6. Experience — done
7. Trust Bar + Reviews — done
8. Owner's Note / Story — done
9. FAQ — done
10. Booking Flow — done
11. Location / How to Reach Us — done
12. WhatsApp Contact — done
13. Polish Pass — done
14. Security & Config — done
15. Brochure — done

## Extra passes already added

- Premium placeholder image generation
- Reviews page upgrade
- Booking estimate and concierge-style flow
- Location route system upgrade
- Accessibility / QA pass
- Deployment handoff
- OpenGraph/Twitter images
- Health endpoint
- Optional booking webhook
- Optional first-party analytics event endpoint
- Ambient sound toggle
- Branded 404/error/loading states

## Added in latest pass

- Booking success now includes a `WhatsApp reference` CTA.
- The CTA sends the inquiry reference, selected room, and dates into WhatsApp so the user can continue the conversation with context.
- The click is tracked as `whatsapp_click` with label `booking_success_whatsapp`.

## Remaining items before a real production launch

These are not MVP blockers, but they are the next logical production upgrades:

1. Replace generated placeholder imagery with real drone footage, Blender renders, and hotel photography.
2. Add real Google Maps embed/style URL and verified map pin once the exact property location is final.
3. Connect `/reviews` to Google Places API or a CMS once real reviews exist.
4. Add reCAPTCHA v3 or Turnstile if spam becomes a problem beyond honeypot + rate limiting.
5. Connect `BOOKING_WEBHOOK_URL` to a real CRM/Zapier/Make workflow.
6. Connect `ANALYTICS_WEBHOOK_URL` to a real reporting destination.
7. Add real payment only in Phase 2 via hosted Stripe Checkout; do not handle card data directly.
8. Add Supabase/Postgres + RLS only if persistent bookings or user accounts are introduced.
9. Run browser/device QA on real iOS Safari, Android Chrome, desktop Safari, Chrome, and Firefox.
10. Export the brochure to final PDF after client approves content and imagery.
