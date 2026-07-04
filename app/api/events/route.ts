import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv, getSiteUrl } from '@/lib/env';
import { guardRequest, sanitizeInput } from '@/lib/security/request-guard';

export const runtime = 'nodejs';

const WEBHOOK_TIMEOUT_MS = 2_000;

export async function POST(req: NextRequest) {
  // ─── HARDENED: Security guard ───
  const guard = await guardRequest(req, {
    validateOrigin: true,
    blockBots: true,
    rateLimit: { limit: 40, windowMs: 60_000 },
    maxBodyBytes: 5_000,
  });
  if (!guard.passed) return guard.response!;

  const body = await req.json().catch(() => ({}));
  const { name, path: eventPath, label, value, timestamp } = body;

  if (!name) {
    return NextResponse.json({ error: 'Event name required' }, { status: 400 });
  }

  // ─── HARDENED: Sanitize event data ───
  const eventData = {
    name: sanitizeInput(String(name || ''), 80),
    path: sanitizeInput(String(eventPath || ''), 200),
    label: sanitizeInput(String(label || ''), 100),
    value: sanitizeInput(String(value || ''), 100),
    timestamp: timestamp || new Date().toISOString(),
    ip: guard.ip,
    userAgent: req.headers.get('user-agent')?.substring(0, 100) || '',
  };

  // Forward to analytics webhook if configured
  const { ANALYTICS_WEBHOOK_URL, ANALYTICS_WEBHOOK_SECRET } = getServerEnv();
  if (ANALYTICS_WEBHOOK_URL) {
    const payload = JSON.stringify({
      source: 'balta-vista-events',
      siteUrl: getSiteUrl(),
      event: eventData,
    });

    const signature = ANALYTICS_WEBHOOK_SECRET
      ? createHmac('sha256', ANALYTICS_WEBHOOK_SECRET).update(payload).digest('hex')
      : undefined;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
    
    try {
      await fetch(ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(signature ? { 'x-balta-vista-signature': signature } : {}),
        },
        body: payload,
        signal: controller.signal,
      });
    } catch {
      // Analytics failure is non-critical
    } finally {
      clearTimeout(timeout);
    }
  }

  return NextResponse.json({ ok: true });
}
