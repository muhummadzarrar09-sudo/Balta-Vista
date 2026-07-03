# Beta Phase D — Conversion Event Instrumentation

Balta Vista includes privacy-light, first-party event instrumentation without adding a third-party analytics SDK.

## Event endpoint

```txt
POST /api/events
```

Events are:

- validated by `lib/event-schema.ts`
- same-origin checked
- request-size capped
- rate-limited
- optionally forwarded server-side to `ANALYTICS_WEBHOOK_URL`
- optionally signed with HMAC-SHA256 using `ANALYTICS_WEBHOOK_SECRET`

## Environment variables

```bash
ANALYTICS_WEBHOOK_URL=
ANALYTICS_WEBHOOK_SECRET=
```

If `ANALYTICS_WEBHOOK_URL` is empty, the endpoint still validates/rate-limits and returns `ok: true`, but no external forwarding happens.

If `ANALYTICS_WEBHOOK_SECRET` is set, forwarded event payloads include:

```txt
x-balta-vista-event-signature
```

## Events currently emitted

- `cta_click`
  - Hero reserve CTA
  - Nav Book Now CTA
  - Footer booking CTA
- `whatsapp_click`
  - Floating WhatsApp button
  - Footer WhatsApp CTA
  - Booking success WhatsApp continuation
- `reviews_click`
  - Homepage trust bar to `/reviews`
- `booking_step_view`
  - Each booking step view
- `booking_submit_success`
  - Successful inquiry submission
- `ambient_toggle`
  - Ambient sound toggle interaction

## Payload shape

```json
{
  "source": "balta-vista-nathiagali-mvp",
  "siteUrl": "https://example.com",
  "event": {
    "name": "cta_click",
    "path": "/",
    "label": "hero_reserve",
    "value": "optional",
    "timestamp": "2026-07-03T00:00:00.000Z"
  }
}
```

## Signature verification example

Use the raw request body:

```js
import crypto from 'node:crypto';

const expected = crypto
  .createHmac('sha256', process.env.ANALYTICS_WEBHOOK_SECRET)
  .update(rawRequestBody)
  .digest('hex');

const valid = expected === request.headers['x-balta-vista-event-signature'];
```

## Public response shape

```json
{
  "ok": true,
  "delivery": {
    "configured": true,
    "delivered": true,
    "signed": true
  }
}
```

## Privacy posture

No third-party tracking scripts are installed. No ad pixels are installed. Events are first-party and intentionally limited to conversion behavior, not invasive session recording.

## QA checklist

- Send invalid event: expect 400.
- Send valid event without webhook: expect `configured: false`.
- Send valid event with webhook: expect `configured: true`.
- Add `ANALYTICS_WEBHOOK_SECRET`: receiver gets `x-balta-vista-event-signature`.
- Confirm no analytics SDK is added to the client bundle.
