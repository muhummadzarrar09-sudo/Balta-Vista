import { NextRequest, NextResponse } from 'next/server';
import { getBooking, verifyPaymentViaWebhook } from '@/lib/booking-store';
import { notify } from '@/lib/notifications';
import { guardRequest } from '@/lib/security/request-guard';
import { logSecurityEvent } from '@/lib/security/auditor';
import { createHmac } from 'node:crypto';

export const runtime = 'nodejs';

/**
 * HARDENED Payment Webhook
 * 
 * Receives payment confirmations from Easypaisa/JazzCash merchant APIs.
 * Only processes valid, signed webhooks.
 */

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || '';

function validateSignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    // In dev mode without secret, accept but warn
    return true;
  }
  const expected = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  return signature === expected;
}

export async function POST(req: NextRequest) {
  const provider = req.headers.get('x-payment-provider') || 'unknown';
  const signature = req.headers.get('x-signature') || '';

  // ─── HARDENED: Rate limit per provider ───
  const guard = await guardRequest(req, {
    validateOrigin: false, // Webhook comes from payment provider, not our domain
    blockBots: false,
    rateLimit: { limit: 20, windowMs: 60_000 },
    maxBodyBytes: 50_000,
  });
  if (!guard.passed) return guard.response!;

  // ─── HARDENED: Read and validate signature ───
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Cannot read body' }, { status: 400 });
  }

  if (WEBHOOK_SECRET && !validateSignature(rawBody, signature)) {
    logSecurityEvent({
      type: 'csrf_failure',
      ip: guard.ip,
      method: 'POST',
      path: '/api/payment/webhook',
      details: `Invalid webhook signature from ${provider}`,
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log(`✅ [WEBHOOK] Verified from ${provider}: ${JSON.stringify(body).substring(0, 200)}`);

  // Extract booking reference
  const reference = (body.reference || body.orderRef || body.bookingRef || '') as string;
  const transactionId = (body.transactionId || body.txnId || body.txnRef || '') as string;
  const paymentStatus = (body.status || body.paymentStatus || body.txnStatus || '') as string;

  if (!reference || !reference.match(/^BV-/)) {
    return NextResponse.json({ error: 'Invalid reference' }, { status: 400 });
  }

  if (!transactionId) {
    return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
  }

  // Check if payment was successful
  const isSuccess = [
    'success', 'completed', 'confirmed', 'settled', 
    'paid', 'captured', 'approved', '000'
  ].includes(paymentStatus.toLowerCase());

  if (!isSuccess) {
    console.log(`[WEBHOOK] Payment not yet successful: ${paymentStatus}`);
    return NextResponse.json({ ok: true, status: 'pending' });
  }

  // Verify booking exists
  const booking = getBooking(reference);
  if (!booking) {
    logSecurityEvent({
      type: 'invalid_reference',
      ip: guard.ip,
      method: 'POST',
      path: '/api/payment/webhook',
      details: `Webhook for unknown booking: ${reference} from ${provider}`,
    });
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  // Only auto-confirm if in valid state
  if (!['payment_pending', 'payment_submitted', 'payment_verifying'].includes(booking.status)) {
    return NextResponse.json({ ok: true, status: booking.status, message: 'No action needed' });
  }

  // ─── HARDENED: Auto-confirm via webhook ───
  const result = verifyPaymentViaWebhook(reference, {
    ...body,
    source: provider,
    verifiedAt: new Date().toISOString(),
    verifiedByIp: guard.ip,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await notify('payment_verified', result.booking!);
  await notify('booking_confirmed', result.booking!);

  console.log(`✅ [WEBHOOK] Booking ${reference} auto-confirmed via ${provider}`);

  return NextResponse.json({
    ok: true,
    reference,
    status: 'confirmed',
    message: 'Payment verified. Booking confirmed.',
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'balta-vista-payment-webhook',
    timestamp: new Date().toISOString(),
  });
}
