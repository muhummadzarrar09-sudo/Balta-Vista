import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { eventSchema } from '@/lib/event-schema';
import { getServerEnv, getSiteUrl } from '@/lib/env';
import { rateLimit } from '@/lib/rate-limit';
import { isAllowedOrigin, sanitizeBookingPayload } from '@/lib/security';

export const runtime = 'nodejs';

const LIMIT = 40;
const WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 4_000;
const WEBHOOK_TIMEOUT_MS = 1_500;

function clientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}

function signPayload(payload: string, secret?: string) {
  if (!secret) return undefined;
  return createHmac('sha256', secret).update(payload).digest('hex');
}

async function forwardEvent(event: ReturnType<typeof eventSchema.parse>) {
  const { ANALYTICS_WEBHOOK_URL, ANALYTICS_WEBHOOK_SECRET } = getServerEnv();
  if (!ANALYTICS_WEBHOOK_URL) return { configured: false, delivered: false, signed: false };

  const payload = JSON.stringify({ source: 'balta-vista-nathiagali-mvp', siteUrl: getSiteUrl(), event });
  const signature = signPayload(payload, ANALYTICS_WEBHOOK_SECRET || undefined);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(ANALYTICS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(signature ? { 'x-balta-vista-event-signature': signature } : {})
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
  if (!isAllowedOrigin(req.headers.get('origin'), req.headers.get('host'))) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 });
  }

  const limit = rateLimit(`events:${clientIp(req)}`, LIMIT, WINDOW_MS);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many events.' }, { status: 429 });

  const body: unknown = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid event.' }, { status: 400 });

  const safeEvent = sanitizeBookingPayload({ ...parsed.data, timestamp: parsed.data.timestamp || new Date().toISOString() });
  const delivery = await forwardEvent(safeEvent);

  return NextResponse.json({ ok: true, delivery });
}
