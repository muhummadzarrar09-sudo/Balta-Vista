import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema, type BookingInput } from '@/lib/booking-schema';
import { getServerEnv, getSiteUrl } from '@/lib/env';
import { rateLimit } from '@/lib/rate-limit';
import { isAllowedOrigin, sanitizeBookingPayload } from '@/lib/security';

export const runtime = 'nodejs';

const WINDOW_MS = 60_000;
const LIMIT = 6;
const MAX_BODY_BYTES = 12_000;
const WEBHOOK_TIMEOUT_MS = 3_500;

function clientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}

function withRateLimitHeaders(res: NextResponse, result: { remaining: number; resetAt: number }) {
  res.headers.set('X-RateLimit-Limit', String(LIMIT));
  res.headers.set('X-RateLimit-Remaining', String(result.remaining));
  res.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));
  return res;
}

async function deliverLead(reference: string, data: BookingInput) {
  const { BOOKING_WEBHOOK_URL } = getServerEnv();
  if (!BOOKING_WEBHOOK_URL) return { configured: false, delivered: false };

  const controller = new AbortController();
  const timeout = windowlessTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(BOOKING_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        reference,
        source: 'pine-peak-nathiagali-mvp',
        siteUrl: getSiteUrl(),
        createdAt: new Date().toISOString(),
        booking: data
      }),
      signal: controller.signal
    });
    return { configured: true, delivered: res.ok };
  } catch {
    return { configured: true, delivered: false };
  } finally {
    clearTimeout(timeout);
  }
}

function windowlessTimeout(callback: () => void, ms: number) {
  return setTimeout(callback, ms);
}

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req.headers.get('origin'), req.headers.get('host'))) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 });
  }

  const limit = rateLimit(`booking:${clientIp(req)}`, LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return withRateLimitHeaders(NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 }), limit);
  }

  const body: unknown = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return withRateLimitHeaders(NextResponse.json({ error: 'Invalid booking inquiry', issues: parsed.error.flatten() }, { status: 400 }), limit);
  }

  const safeData = sanitizeBookingPayload(parsed.data);
  if (safeData.companyWebsite) return withRateLimitHeaders(NextResponse.json({ ok: true }), limit);

  const reference = `PP-${Date.now().toString(36).toUpperCase()}`;
  const delivery = await deliverLead(reference, safeData);

  // MVP scope: this endpoint validates, sanitizes, origin-checks, size-checks, honeypot-checks, rate-limits,
  // and optionally forwards the inquiry to a server-side webhook. It does not collect payment or create accounts.
  // Phase 2/payment note: when payments are added, use Stripe/hosted checkout so this app never handles raw card data.
  // If user accounts or persistent booking records are added, introduce Supabase/Postgres with RLS at that point.
  // RLS/Postgres-level security is not applicable to this no-auth MVP.
  return withRateLimitHeaders(NextResponse.json({ ok: true, reference, delivery }), limit);
}
