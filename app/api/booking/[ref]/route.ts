import { NextRequest, NextResponse } from 'next/server';
import { getBooking } from '@/lib/booking-store';
import { guardRequest } from '@/lib/security/request-guard';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  // ─── HARDENED: Lightweight guard for GET (rate limit only) ───
  const guard = await guardRequest(req, {
    validateOrigin: false,
    blockBots: false,
    rateLimit: { limit: 20, windowMs: 60_000 },
  });
  if (!guard.passed) return guard.response!;

  const { ref } = await params;
  const reference = ref.toUpperCase();

  if (!reference || !/^BV-[A-Z0-9]{6,}$/.test(reference)) {
    return NextResponse.json({ error: 'Invalid booking reference' }, { status: 400 });
  }

  const booking = getBooking(reference);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  // Return safe public data only
  return NextResponse.json({
    reference: booking.reference,
    status: booking.status,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    expiresAt: booking.expiresAt,
    name: booking.name,
    guests: booking.guests,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    room: booking.room,
    roomName: booking.roomName,
    rate: booking.rate,
    estimatedNights: booking.estimatedNights,
    estimatedTotal: booking.estimatedTotal,
    arrivalWindow: booking.arrivalWindow,
    payment: booking.payment ? {
      methodId: booking.payment.methodId,
      methodName: booking.payment.methodName,
      transactionId: booking.payment.transactionId,
      submittedAt: booking.payment.submittedAt,
      confirmedAt: booking.payment.confirmedAt,
      verifiedBy: booking.payment.verifiedBy,
      webhookConfirmed: booking.payment.webhookConfirmed,
    } : undefined,
    auditLog: booking.auditLog.slice(-10).map((e) => ({
      timestamp: e.timestamp,
      action: e.action,
      notes: e.notes,
    })),
  });
}
