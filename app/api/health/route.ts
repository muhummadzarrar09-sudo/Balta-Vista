import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'balta-vista-nathiagali-mvp',
    timestamp: new Date().toISOString(),
    scope: 'marketing-booking-mvp'
  });
}
