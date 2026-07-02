import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const shouldForceHttps = process.env.VERCEL === '1' || process.env.FORCE_HTTPS === 'true';
  if (process.env.NODE_ENV === 'production' && shouldForceHttps) {
    const proto = req.headers.get('x-forwarded-proto');
    const host = req.headers.get('host') || req.nextUrl.host || '';
    const hostname = req.nextUrl.hostname || host.split(':')[0] || '';
    const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(hostname) || host.startsWith('localhost') || host.startsWith('127.0.0.1');
    if (proto === 'http' && !isLocalhost) {
      const url = req.nextUrl.clone();
      url.protocol = 'https:';
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
