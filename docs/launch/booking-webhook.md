# Beta Phase C — Booking Workflow Integration

Balta Vista booking inquiries can be forwarded from the server to a CRM, Zapier, Make, email automation endpoint, or private lead intake service.

## Environment Variables

```bash
BOOKING_WEBHOOK_URL=
BOOKING_WEBHOOK_SECRET=
```

`BOOKING_WEBHOOK_URL` is optional. If it is empty, booking inquiries still validate and return a reference, but no external delivery is attempted.

`BOOKING_WEBHOOK_SECRET` is optional but recommended for Beta/production integrations. If present, the server signs the exact JSON payload using HMAC-SHA256 and sends the signature in:

```txt
x-balta-vista-signature
```

## Webhook Payload

```json
{
  "reference": "BV-MR...",
  "source": "balta-vista-nathiagali-mvp",
  "siteUrl": "https://example.com",
  "createdAt": "2026-07-03T00:00:00.000Z",
  "booking": {
    "checkIn": "2026-08-01",
    "checkOut": "2026-08-03",
    "room": "double",
    "name": "Guest Name",
    "email": "guest@example.com",
    "phone": "923001234567",
    "guests": 2,
    "arrivalWindow": "afternoon",
    "message": "Optional message",
    "companyWebsite": ""
  }
}
```

## Signature Verification Example

The receiver should compute:

```js
import crypto from 'node:crypto';

const expected = crypto
  .createHmac('sha256', process.env.BOOKING_WEBHOOK_SECRET)
  .update(rawRequestBody)
  .digest('hex');

const valid = expected === request.headers['x-balta-vista-signature'];
```

Use the raw request body, not parsed/re-serialized JSON, to verify the signature.

## Booking API Response

The public client receives only safe delivery status:

```json
{
  "ok": true,
  "reference": "BV-MR...",
  "delivery": {
    "configured": true,
    "delivered": true,
    "signed": true
  }
}
```

No submitted personal details are echoed back to the browser.

## Timeout Behavior

Webhook delivery times out after 3.5 seconds. If the webhook fails, the user still receives a booking reference. This prevents third-party workflow outages from breaking the guest inquiry experience.

## QA Checklist

- Submit invalid payload: expect 400.
- Submit valid payload without webhook: expect `configured: false`.
- Submit valid payload with webhook: expect `configured: true`.
- Enable `BOOKING_WEBHOOK_SECRET`: receiver gets `x-balta-vista-signature`.
- Confirm no personal data is returned in the browser response.
- Confirm CRM/Zapier/Make receives the complete payload.
