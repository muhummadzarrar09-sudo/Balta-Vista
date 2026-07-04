import { NextRequest, NextResponse } from 'next/server';
import { getBooking, submitPayment } from '@/lib/booking-store';
import type { PaymentMethodId } from '@/lib/booking-types';
import { notify } from '@/lib/notifications';
import { guardRequest, sanitizeInput } from '@/lib/security/request-guard';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  // ─── HARDENED: Security guard ───
  const guard = await guardRequest(req, {
    validateOrigin: true,
    blockBots: true,
    rateLimit: { limit: 5, windowMs: 60_000 },
    maxBodyBytes: 5_000,
  });
  if (!guard.passed) return guard.response!;

  const { ref } = await params;
  const reference = ref.toUpperCase();

  // ─── HARDENED: Validate reference format ───
  if (!reference || !/^BV-[A-Z0-9]{6,}$/.test(reference)) {
    return NextResponse.json({ error: 'Invalid booking reference format' }, { status: 400 });
  }

  const booking = getBooking(reference);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (!['inquiry_received', 'payment_pending'].includes(booking.status)) {
    return NextResponse.json({ 
      error: `Cannot submit payment for booking in "${booking.status}" status` 
    }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { methodId, methodName, transactionId, notes } = body;

  if (!methodId || !methodName) {
    return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
  }

  if (!transactionId || transactionId.trim().length < 3) {
    return NextResponse.json({ error: 'Transaction ID is required (min 3 characters)' }, { status: 400 });
  }

  // ─── HARDENED: Sanitize ALL inputs ───
  const cleanMethodId = sanitizeInput(methodId, 30);
  const cleanMethodName = sanitizeInput(methodName, 60);
  const cleanTransactionId = sanitizeInput(transactionId.trim(), 100);

  const result = submitPayment(reference, {
    methodId: cleanMethodId as PaymentMethodId,
    methodName: cleanMethodName,
    transactionId: cleanTransactionId,
    submittedAt: new Date().toISOString(),
    adminNotes: notes ? sanitizeInput(notes, 300) : undefined,
  }, { ipAddress: guard.ip });

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to process payment' }, { status: 500 });
  }

  await notify('payment_submitted', result.booking!);

  return NextResponse.json({
    ok: true,
    reference,
    status: result.booking!.status,
    message: 'Payment details submitted. The team will verify and confirm your booking within 24 hours.',
  });
}
