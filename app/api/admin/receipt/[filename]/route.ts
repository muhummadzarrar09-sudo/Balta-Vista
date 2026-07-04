import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getReceiptPath } from '@/lib/booking-store';
import { guardRequest } from '@/lib/security/request-guard';
import { logSecurityEvent } from '@/lib/security/auditor';
import { verifyAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const guard = await guardRequest(req, { validateOrigin: true, blockBots: false, rateLimit: { limit: 30, windowMs: 60_000 } });
  if (!guard.passed) return guard.response!;

  // Check session cookie (browser) or Authorization header (API)
  const auth = verifyAdmin(req);

  // Also check signed token (for receipt viewing from admin page)
  const token = req.nextUrl.searchParams.get('token') || '';
  const ADMIN_KEY = process.env.ADMIN_KEY || '';

  let authorized = auth.valid;
  if (!authorized && token) {
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf-8');
      const [timestamp, signature] = decoded.split(':');
      if (Date.now() - parseInt(timestamp) <= 5 * 60 * 1000) {
        const expected = crypto.createHmac('sha256', ADMIN_KEY).update(timestamp).digest('hex').substring(0, 16);
        if (signature === expected) authorized = true;
      }
    } catch {}
  }

  if (!authorized) {
    logSecurityEvent({ type: 'admin_auth_failure', ip: guard.ip, method: 'GET', path: '/api/admin/receipt', details: 'Unauthorized receipt access' });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename } = await params;
  const sanitized = path.basename(filename);
  if (!sanitized || sanitized.includes('..') || !sanitized.match(/^BV-[A-Z0-9]+-\d+\.[a-z]+$/i)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const filePath = getReceiptPath(sanitized);
  if (!filePath) return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });

  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(sanitized).toLowerCase();
    const mimeTypes: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf' };
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${sanitized}"`,
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read receipt' }, { status: 500 });
  }
}
