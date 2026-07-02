# Conversion Event Instrumentation

This MVP includes privacy-light event instrumentation without adding a third-party analytics SDK.

## Event endpoint

```txt
POST /api/events
```

Validated by `lib/event-schema.ts`, rate-limited, same-origin checked, and optionally forwarded server-side to:

```txt
ANALYTICS_WEBHOOK_URL
```

## Events currently emitted

- `cta_click`
  - Hero reserve CTA
  - Nav Book Now CTA
- `whatsapp_click`
  - Floating WhatsApp button
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
  "name": "cta_click",
  "path": "/",
  "label": "hero_reserve",
  "value": "optional",
  "timestamp": "2026-07-02T00:00:00.000Z"
}
```

No third-party tracking scripts are installed. If a webhook is not configured, the endpoint simply validates/rate-limits and returns `ok: true`.
