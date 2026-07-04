import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema, type BookingInput } from '@/lib/booking-schema';
import { getServerEnv, getSiteUrl, getWhatsAppNumber } from '@/lib/env';
import { isAllowedOrigin, sanitizeBookingPayload } from '@/lib/security';
import { createBooking, generateReference } from '@/lib/booking-store';
import { ROOM_RATES, ROOM_NAMES } from '@/lib/booking-types';
import { guardRequest, sanitizeInput, validateBookingAmount } from '@/lib/security/request-guard';
import { checkHoneypot } from '@/lib/security/bot-detector';
import { logSecurityEvent } from '@/lib/security/auditor';

export const runtime = 'nodejs';

const WEBHOOK_TIMEOUT_MS = 3_500;

function signPayload(payload: string, secret?: string) {
  if (!secret) return undefined;
  return createHmac('sha256', secret).update(payload).digest('hex');
}

async function deliverLead(reference: string, data: BookingInput) {
  const { BOOKING_WEBHOOK_URL, BOOKING_WEBHOOK_SECRET } = getServerEnv();
  if (!BOOKING_WEBHOOK_URL) return { configured: false, delivered: false, signed: false };

  const payload = JSON.stringify({
    reference,
    source: 'balta-vista-nathiagali-mvp',
    siteUrl: getSiteUrl(),
    createdAt: new Date().toISOString(),
    booking: data
  });
  const signature = signPayload(payload, BOOKING_WEBHOOK_SECRET || undefined);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(BOOKING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(signature ? { 'x-balta-vista-signature': signature } : {})
      },
      body: payload,
      signal: controller.signal
    });
    return { configured: true, delivered: res.ok, signed: Boolean(signature) };
  } catch {
    return { configured: true, delivered: false, signed: Boolean(signature) };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  // ─── HARDENED: Security guard ───
  const guard = await guardRequest(req, {
    validateOrigin: true,
    blockBots: true,
    checkTiming: true,
    rateLimit: { limit: 4, windowMs: 60_000 }, // Max 4 booking submissions per minute
    maxBodyBytes: 12_000,
  });
  if (!guard.passed) return guard.response!;

  // ─── HARDENED: Honeypot check ───
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Check honeypot BEFORE parsing
  if (checkHoneypot(body as Record<string, unknown>, ['companyWebsite', 'website', 'url', 'fax', 'phone2', 'homepage'])) {
    logSecurityEvent({
      type: 'honeypot_triggered',
      ip: guard.ip,
      method: 'POST',
      path: '/api/booking',
      details: 'Honeypot field was filled — blocking submission',
    });
    // Return success to not alert the bot, but don't actually save
    return NextResponse.json({ ok: true, reference: 'HONEYPOT-BLOCKED' });
  }

  // ─── Parse + Validate ───
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking inquiry' }, { status: 400 });
  }

  const safeData = sanitizeBookingPayload(parsed.data);

  // ─── HARDENED: Server-side amount validation ───
  // Prevents someone from modifying the room rate in dev console
  const amountValidation = validateBookingAmount(safeData.room, safeData.checkIn, safeData.checkOut);
  if (!amountValidation.valid || amountValidation.nights > 30) {
    logSecurityEvent({
      type: 'amount_tampering',
      ip: guard.ip,
      method: 'POST',
      path: '/api/booking',
      details: `Invalid booking: ${safeData.room}, ${safeData.checkIn} → ${safeData.checkOut}, ${amountValidation.nights} nights`,
    });
    return NextResponse.json({ error: 'Invalid booking dates' }, { status: 400 });
  }

  // ─── HARDENED: Sanitize ALL user input before storage ───
  safeData.name = sanitizeInput(safeData.name, 80);
  safeData.email = sanitizeInput(safeData.email, 120).toLowerCase();
  safeData.phone = sanitizeInput(safeData.phone, 30);
  safeData.message = safeData.message ? sanitizeInput(safeData.message, 500) : '';
  safeData.arrivalWindow = safeData.arrivalWindow || 'unsure';

  const reference = generateReference();
  const rate = ROOM_RATES[safeData.room] || 85000;
  const checkIn = new Date(safeData.checkIn);
  const checkOut = new Date(safeData.checkOut);
  const nights = amountValidation.nights;

  // Store booking persistently
  const booking = createBooking({
    reference,
    name: safeData.name,
    email: safeData.email,
    phone: safeData.phone,
    guests: safeData.guests,
    checkIn: safeData.checkIn,
    checkOut: safeData.checkOut,
    room: safeData.room,
    roomName: ROOM_NAMES[safeData.room] || safeData.room,
    rate,
    estimatedNights: nights,
    estimatedTotal: nights * rate,
    arrivalWindow: safeData.arrivalWindow,
    message: safeData.message,
  });

  const delivery = await deliverLead(reference, safeData);
  const whatsapp = getWhatsAppNumber();

  return NextResponse.json({
    ok: true,
    reference,
    status: booking.status,
    whatsapp,
    delivery,
  });
}
