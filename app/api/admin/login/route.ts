import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

const ADMIN_KEY = process.env.ADMIN_KEY || '';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_TTL = 6 * 60 * 60 * 1000; // 6 hours

function generateSessionToken(ip: string): string {
  const payload = `${ip}:${Date.now()}:${crypto.randomBytes(8).toString('hex')}`;
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
  return token;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { key } = body;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

  if (!key || key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
  }

  const token = generateSessionToken(ip);
  const response = NextResponse.json({
    ok: true,
    message: 'Authenticated',
    expiresIn: SESSION_TTL / 1000 / 60 / 60, // hours
  });

  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: SESSION_TTL / 1000,
  });

  return response;
}
