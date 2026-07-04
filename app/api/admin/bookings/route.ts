import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, getDashboardStats } from '@/lib/booking-store';
import { guardRequest } from '@/lib/security/request-guard';
import { logSecurityEvent } from '@/lib/security/auditor';
import { verifyAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const guard = await guardRequest(req, {
    validateOrigin: true,
    blockBots: true,
    rateLimit: { limit: 30, windowMs: 60_000 },
  });
  if (!guard.passed) return guard.response!;

  const auth = verifyAdmin(req);
  if (!auth.valid) {
    logSecurityEvent({
      type: 'admin_auth_failure',
      ip: guard.ip,
      method: 'GET',
      path: '/api/admin/bookings',
      details: auth.reason || 'Unauthorized',
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = getAllBookings();
  const stats = getDashboardStats();
  return NextResponse.json({ bookings, stats });
}
