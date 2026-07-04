/**
 * HTML Email Templates for Balta Vista
 * Branded, responsive, dark-theme compatible.
 */

const BRAND_COLOR = '#c08b3e';
const BG_DARK = '#11130f';
const BG_CARD = '#1c2018';
const TEXT_LIGHT = '#eadcc4';
const TEXT_MUTED = '#a79a84';
const TEXT_GOLD = '#c08b3e';

function baseHtml(content: string, preview: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Balta Vista</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${BG_DARK}; color: ${TEXT_LIGHT}; font-family: 'Inter', -apple-system, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px; }
    .card { background: ${BG_CARD}; border-radius: 24px; padding: 40px 32px; border: 1px solid rgba(192,139,62,0.12); }
    .badge { display: inline-block; background: rgba(192,139,62,0.12); color: ${TEXT_GOLD}; padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; }
    .divider { height: 1px; background: rgba(234,220,196,0.08); margin: 24px 0; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
    .label { color: ${TEXT_MUTED}; font-size: 12px; }
    .value { font-size: 14px; font-weight: 600; color: ${TEXT_LIGHT}; }
    .value-gold { color: ${TEXT_GOLD}; font-size: 18px; font-weight: 700; }
    .btn { display: inline-block; background: ${BRAND_COLOR}; color: ${BG_DARK}; padding: 14px 32px; border-radius: 999px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; }
    .btn-outline { display: inline-block; border: 1px solid rgba(234,220,196,0.15); color: ${TEXT_LIGHT}; padding: 14px 32px; border-radius: 999px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; }
    .footer { text-align: center; padding: 32px 0 0; font-size: 12px; color: ${TEXT_MUTED}; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin: 8px 0 4px; color: ${TEXT_LIGHT}; }
    p { font-size: 14px; line-height: 1.7; color: ${TEXT_MUTED}; margin: 12px 0; }
    .mt24 { margin-top: 24px; }
    .mt16 { margin-top: 16px; }
    .text-center { text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="text-center" style="margin-bottom: 16px;">
      <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: ${TEXT_GOLD};">◆</span>
      <p style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: ${TEXT_LIGHT}; margin: 4px 0 0;">Balta Vista</p>
      <p style="font-size: 11px; color: ${TEXT_MUTED}; letter-spacing: 0.2em; text-transform: uppercase;">Nathiagali · KPK</p>
    </div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <p>Balta Vista Nathiagali · Khyber Pakhtunkhwa, Pakistan</p>
      <p style="margin-top: 8px;">
        <a href="{{SITE_URL}}" style="color: ${TEXT_GOLD}; text-decoration: none;">Visit website</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Templates ───

export function bookingConfirmationGuest(props: {
  name: string;
  reference: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  estimatedTotal: number;
  siteUrl: string;
}) {
  const subject = `Booking Inquiry Received — Balta Vista (${props.reference})`;
  const html = baseHtml(`
    <div class="text-center">
      <span style="font-size: 40px;">📩</span>
      <h1>Inquiry received.</h1>
      <p>Thank you, ${props.name}. Your opening-season inquiry has been received by the Balta Vista reservations desk.</p>
    </div>

    <div class="divider"></div>

    <div class="row"><span class="label">Reference</span><span class="value" style="color: ${TEXT_GOLD}; font-family: monospace;">${props.reference}</span></div>
    <div class="row"><span class="label">Room</span><span class="value">${props.roomName}</span></div>
    <div class="row"><span class="label">Check-in</span><span class="value">${props.checkIn}</span></div>
    <div class="row"><span class="label">Check-out</span><span class="value">${props.checkOut}</span></div>
    <div class="row"><span class="label">Nights</span><span class="value">${props.nights}</span></div>
    <div class="row"><span class="label">Estimated total</span><span class="value-gold">PKR ${props.estimatedTotal.toLocaleString('en-PK')}</span></div>

    <div class="divider"></div>

    <p style="font-size: 13px;">The reservations team will review your dates and confirm availability directly. You'll hear from us within 24 hours.</p>

    <div class="text-center mt24">
      <a href="${props.siteUrl}/booking/confirmation?ref=${props.reference}" class="btn">Manage your booking</a>
    </div>
  `, subject);

  return { subject, html };
}

export function adminNewInquiryAlert(props: {
  name: string;
  reference: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  estimatedTotal: number;
  phone: string;
  email: string;
  adminUrl: string;
}) {
  const subject = `🔔 New Booking Inquiry — ${props.reference} (${props.name})`;
  const html = baseHtml(`
    <div class="text-center">
      <span style="font-size: 40px;">🔔</span>
      <h1>New inquiry</h1>
      <p>A new booking inquiry has been submitted.</p>
    </div>

    <div class="divider"></div>

    <span class="badge">Action: Review availability</span>

    <div class="row mt16"><span class="label">Reference</span><span class="value" style="font-family: monospace;">${props.reference}</span></div>
    <div class="row"><span class="label">Guest</span><span class="value">${props.name}</span></div>
    <div class="row"><span class="label">Room</span><span class="value">${props.roomName}</span></div>
    <div class="row"><span class="label">Dates</span><span class="value">${props.checkIn} → ${props.checkOut}</span></div>
    <div class="row"><span class="label">Amount</span><span class="value-gold">PKR ${props.estimatedTotal.toLocaleString('en-PK')}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${props.phone}</span></div>
    <div class="row"><span class="label">Email</span><span class="value">${props.email}</span></div>

    <div class="divider"></div>

    <div class="text-center mt24">
      <a href="${props.adminUrl}" class="btn">View in admin →</a>
    </div>
  `, subject);

  return { subject, html };
}

export function adminPaymentAlert(props: {
  name: string;
  reference: string;
  roomName: string;
  amount: number;
  methodName: string;
  transactionId: string;
  adminUrl: string;
}) {
  const subject = `💰 Payment Submitted — ${props.reference} (${props.name})`;
  const html = baseHtml(`
    <div class="text-center">
      <span style="font-size: 40px;">💰</span>
      <h1>Payment submitted</h1>
      <p style="color: ${TEXT_GOLD}; font-weight: 600;">ACTION REQUIRED — Verify receipt</p>
    </div>

    <div class="divider"></div>

    <div class="row"><span class="label">Reference</span><span class="value" style="font-family: monospace;">${props.reference}</span></div>
    <div class="row"><span class="label">Guest</span><span class="value">${props.name}</span></div>
    <div class="row"><span class="label">Room</span><span class="value">${props.roomName}</span></div>
    <div class="row"><span class="label">Amount</span><span class="value-gold">PKR ${props.amount.toLocaleString('en-PK')}</span></div>
    <div class="row"><span class="label">Payment method</span><span class="value">${props.methodName}</span></div>
    <div class="row"><span class="label">Transaction ID</span><span class="value" style="font-family: monospace;">${props.transactionId}</span></div>

    <div class="divider"></div>

    <div class="text-center mt24">
      <a href="${props.adminUrl}" class="btn">Verify payment →</a>
    </div>
  `, subject);

  return { subject, html };
}

export function bookingConfirmedGuest(props: {
  name: string;
  reference: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  estimatedTotal: number;
  siteUrl: string;
}) {
  const subject = `✓ Booking Confirmed — Balta Vista (${props.reference})`;
  const html = baseHtml(`
    <div class="text-center">
      <span style="font-size: 40px;">✓</span>
      <h1>Booking confirmed!</h1>
      <p>Your stay at Balta Vista is confirmed, ${props.name}. We look forward to welcoming you.</p>
    </div>

    <div class="divider"></div>

    <div class="row"><span class="label">Reference</span><span class="value" style="color: ${TEXT_GOLD}; font-family: monospace;">${props.reference}</span></div>
    <div class="row"><span class="label">Room</span><span class="value">${props.roomName}</span></div>
    <div class="row"><span class="label">Check-in</span><span class="value">${props.checkIn}</span></div>
    <div class="row"><span class="label">Check-out</span><span class="value">${props.checkOut}</span></div>
    <div class="row"><span class="label">Nights</span><span class="value">${props.nights}</span></div>
    <div class="row"><span class="label">Total paid</span><span class="value-gold">PKR ${props.estimatedTotal.toLocaleString('en-PK')}</span></div>

    <div class="divider"></div>

    <div style="background: rgba(192,139,62,0.08); border-radius: 16px; padding: 20px; margin: 16px 0;">
      <p style="font-size: 13px; font-weight: 600; margin: 0 0 8px;">📍 Getting here</p>
      <p style="font-size: 13px; margin: 0;">The hotel team can confirm road conditions and arrival guidance. Reach us on WhatsApp with your reference number.</p>
    </div>

    <div class="text-center mt24">
      <a href="${props.siteUrl}/booking/confirmation?ref=${props.reference}" class="btn">View booking details</a>
    </div>
  `, subject);

  return { subject, html };
}
