import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { guardRequest } from '@/lib/security/request-guard';
import { logSecurityEvent } from '@/lib/security/auditor';
import { verifyAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const ADMIN_KEY = process.env.ADMIN_KEY || '';

export async function POST(req: NextRequest) {
  const guard = await guardRequest(req, {
    validateOrigin: true,
    blockBots: true,
    rateLimit: { limit: 30, windowMs: 60_000 },
  });
  if (!guard.passed) return guard.response!;

  const auth = verifyAdmin(req);
  if (!auth.valid) {
    logSecurityEvent({ type: 'admin_auth_failure', ip: guard.ip, method: 'POST', path: '/api/admin/receipt-token', details: auth.reason || 'Unauthorized' });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const filename = body.filename;
  if (!filename || typeof filename !== 'string') {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }

  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', ADMIN_KEY).update(timestamp).digest('hex').substring(0, 16);
  const token = Buffer.from(`${timestamp}:${signature}`).toString('base64url');

  return NextResponse.json({
    url: `/api/admin/receipt/${encodeURIComponent(filename)}?token=${token}`,
    expiresIn: 300,
  });
}
