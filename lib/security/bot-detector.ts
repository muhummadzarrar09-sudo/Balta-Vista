/**
 * Bot / AI Agent Detection
 * 
 * Multiple layers of bot detection that work server-side.
 * No front-end trick can bypass these.
 */

import type { NextRequest } from 'next/server';

export interface BotScore {
  score: number;        // 0 = human, 100 = definitely bot
  signals: string[];    // What triggered the detection
  isBot: boolean;       // threshold >= 60
}

const SUSPICIOUS_UA_PATTERNS = [
  /python[-]?requests/i,
  /curl\//i,
  /wget\//i,
  /go-http-client/i,
  /axios/i,
  /java\/[\d.]+/i,
  /libwww-perl/i,
  /php\/[\d.]+/i,
  /ruby/i,
  /scrapy/i,
  /aiohttp/i,
  /httpx/i,
  /httrack/i,
  /postman/i,
  /insomnia/i,
  /node[-]?fetch/i,
  /got\//i,
  /okhttp/i,
  /httpclient/i,
  /bot\//i,
  /crawler/i,
  /spider/i,
  /scanner/i,
  /headless/i,
  /phantomjs/i,
  /puppeteer/i,
  /selenium/i,
  /playwright/i,
];

const KNOWN_BOT_IPS = new Set<string>([
  // Common data center / cloud IPs that should never book a hotel
  // This is a small sample — in production, use a proper IP reputation service
]);

/**
 * Analyze a request for bot signals
 */
export function detectBot(req: NextRequest): BotScore {
  let score = 0;
  const signals: string[] = [];

  const ua = req.headers.get('user-agent') || '';
  const accept = req.headers.get('accept') || '';
  const acceptLang = req.headers.get('accept-language') || '';
  const secFetchSite = req.headers.get('sec-fetch-site') || '';
  const secFetchMode = req.headers.get('sec-fetch-mode') || '';
  const secFetchDest = req.headers.get('sec-fetch-dest') || '';
  const referer = req.headers.get('referer') || '';
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '';

  // 1. Missing or suspicious User-Agent (+30 points)
  if (!ua || ua.length < 20) {
    score += 30;
    signals.push('Missing or short User-Agent');
  }

  // 2. Known bot User-Agent patterns (+40 points)
  for (const pattern of SUSPICIOUS_UA_PATTERNS) {
    if (pattern.test(ua)) {
      score += 40;
      signals.push(`Suspicious User-Agent: ${ua.substring(0, 60)}`);
      break;
    }
  }

  // 3. Missing Accept header (+15 points)
  if (!accept || accept === '*/*') {
    score += 15;
    signals.push('Missing or generic Accept header');
  }

  // 4. Missing or strange Accept-Language (+10 points)
  if (!acceptLang || acceptLang.length < 5) {
    score += 10;
    signals.push('Missing or minimal Accept-Language');
  }

  // 5. Sec-Fetch headers (modern browsers send these) (-15 points for having them)
  if (secFetchSite && secFetchMode && secFetchDest) {
    score -= 15;
  } else {
    score += 15;
    signals.push('Missing Sec-Fetch headers');
  }

  // 6. Cross-site request without proper origin (+20 points)
  if (secFetchSite === 'cross-site' && !referer) {
    score += 20;
    signals.push('Cross-site request without referer');
  }

  // 7. No referer for POST/PUT/DELETE (+10 points)
  const method = req.method;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && !referer) {
    score += 10;
    signals.push('State-changing request without referer');
  }

  // 8. Known bot IP (+50 points)
  if (KNOWN_BOT_IPS.has(ip)) {
    score += 50;
    signals.push(`Known bot IP: ${ip}`);
  }

  return {
    score,
    signals,
    isBot: score >= 60,
  };
}

/**
 * Extract honeypot fields from form data
 * Returns true if a honeypot was triggered
 */
export function checkHoneypot(body: Record<string, unknown>, fields: string[]): boolean {
  for (const field of fields) {
    const value = body[field];
    if (value && typeof value === 'string' && value.length > 0) {
      return true; // Bot filled in hidden field
    }
  }
  return false;
}

/**
 * Check form submission timing
 * If a form is submitted too fast, it's likely a bot
 */
export function checkFormTiming(formSubmittedAt?: string): { tooFast: boolean; seconds: number } {
  if (!formSubmittedAt) return { tooFast: false, seconds: 0 };
  
  const submitted = new Date(formSubmittedAt).getTime();
  const now = Date.now();
  const seconds = (now - submitted) / 1000;

  // Less than 3 seconds to fill a multi-step booking form = bot
  return {
    tooFast: seconds < 3,
    seconds,
  };
}
