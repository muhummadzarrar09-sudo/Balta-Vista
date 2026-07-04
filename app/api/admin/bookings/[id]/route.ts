import { NextRequest, NextResponse } from 'next/server';
import { confirmBooking, transitionBookingStatus, addAdminNote } from '@/lib/booking-store';
import { notify } from '@/lib/notifications';
import { guardRequest, sanitizeInput } from '@/lib/security/request-guard';
import { logSecurityEvent } from '@/lib/security/auditor';
import { verifyAdmin } from '@/lib/admin-auth';
import type { BookingStatus } from '@/lib/booking-types';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await guardRequest(req, {
    validateOrigin: true,
    blockBots: true,
    rateLimit: { limit: 30, windowMs: 60_000 },
    maxBodyBytes: 5_000,
  });
  if (!guard.passed) return guard.response!;

  const auth = verifyAdmin(req);
  if (!auth.valid) {
    logSecurityEvent({
      type: 'admin_auth_failure',
      ip: guard.ip,
      method: 'PATCH',
      path: '/api/admin/bookings/[id]',
      details: auth.reason || 'Unauthorized',
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const reference = id.toUpperCase();
  if (!reference || !/^BV-[A-Z0-9]{6,}$/.test(reference)) {
    return NextResponse.json({ error: 'Invalid reference' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const adminEmail = sanitizeInput(body.confirmedBy || 'admin@balta-vista.com', 80);

  if (body.action === 'confirm') {
    const result = confirmBooking(reference, adminEmail, guard.ip);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    await notify('payment_verified', result.booking!);
    await notify('booking_confirmed', result.booking!);
    return NextResponse.json({ ok: true, status: result.booking!.status, reference: result.booking!.reference });
  }

  if (body.action === 'status' && body.status) {
    const validStatuses: BookingStatus[] = [
      'inquiry_received', 'payment_pending', 'payment_submitted',
      'payment_verifying', 'confirmed', 'checked_in', 'checked_out', 'cancelled'
    ];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const result = transitionBookingStatus(reference, body.status, 'admin', {
      performedByEmail: adminEmail,
      ipAddress: guard.ip,
      notes: sanitizeInput(body.notes || `Status changed to ${body.status}`, 200),
    });
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    if (body.status === 'confirmed') await notify('booking_confirmed', result.booking!);
    else if (body.status === 'cancelled') await notify('booking_cancelled', result.booking!);
    return NextResponse.json({ ok: true, status: result.booking!.status, reference: result.booking!.reference });
  }

  if (body.action === 'note' && body.note) {
    const result = addAdminNote(reference, sanitizeInput(body.note, 1000), adminEmail);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, reference: result.booking!.reference });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
