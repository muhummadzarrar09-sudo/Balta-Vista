/**
 * Security Middleware — Zero-Trust Request Filter
 * Edge Runtime compatible.
 */
import { NextRequest, NextResponse } from 'next/server';

function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  for (let i = 0; i < 24; i++) result += chars[array[i] % chars.length];
  return result;
}

const BLOCKED = [/^\/\.env/, /^\/\.git/, /^\/\.ssh/, /^\/\.aws/, /^\/node_modules/, /^\/data\//, /wp-admin/, /wp-content/];
const SCANNERS = [/acunetix/i, /nmap/i, /sqlmap/i, /nikto/i, /nessus/i, /burpsuite/i, /zap/i, /openvas/i];

export function proxy(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

  const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(hostname);
  const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
  if (isIp && !isLocalhost && process.env.NODE_ENV === 'production') {
    return new NextResponse('Direct IP not allowed', { status: 403 });
  }

  if (pathname.includes('..') || pathname.includes('%2e%2e')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  for (const p of BLOCKED) { if (p.test(pathname)) return new NextResponse('Forbidden', { status: 403 }); }
  
  const ua = req.headers.get('user-agent') || '';
  for (const s of SCANNERS) { if (s.test(ua)) return new NextResponse('Forbidden', { status: 403 }); }

  const res = NextResponse.next();
  if (!req.cookies.has('bv_session')) {
    res.cookies.set('bv_session', generateSessionId(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 86400 });
  }
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  res.headers.set('X-Download-Options', 'noopen');
  res.headers.delete('X-Powered-By');
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
