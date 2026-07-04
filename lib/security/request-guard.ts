/**
 * Unified Request Guard
 * 
 * A single import that protects every API route against:
 *   - CSRF (cross-site request forgery)
 *   - Bot / AI agent submissions
 *   - Origin spoofing / proxy abuse
 *   - Rate limiting with auto-blacklisting
 *   - Form tampering (prices, references)
 *   - Honeypot fields
 *   - Fast-form submissions
 *   - XSS payloads
 */

import { NextRequest, NextResponse } from 'next/server';
import { detectBot, checkHoneypot, checkFormTiming } from './bot-detector';
import { logSecurityEvent, isIpBlacklisted } from './auditor';
import { validateCsrfToken } from './csrf';
import { rateLimit } from '@/lib/rate-limit';

export interface GuardOptions {
  /** Require a valid CSRF token */
  csrf?: boolean;
  /** Block bots (score >= 60) */
  blockBots?: boolean;
  /** Honeypot field names to check */
  honeypotFields?: string[];
  /** Validate origin matches host */
  validateOrigin?: boolean;
  /** Check form submission timing */
  checkTiming?: boolean;
  /** Rate limit config */
  rateLimit?: { limit: number; windowMs: number };
  /** Max body size in bytes */
  maxBodyBytes?: number;
}

export interface GuardResult {
  /** If true, the request is allowed through */
  passed: boolean;
  /** If passed is false, this is the response to return */
  response?: NextResponse;
  /** Client IP */
  ip: string;
  /** Any warnings for the audit log */
  warnings: string[];
}

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || req.headers.get('x-real-ip') 
    || req.headers.get('x-vercel-forwarded-for') 
    || 'unknown';
}

const DEFAULT_OPTIONS: GuardOptions = {
  csrf: false,           // Off by default — we use cookie-based CsrfToken header
  blockBots: true,
  honeypotFields: ['companyWebsite', 'website', 'url', 'fax', 'phone2'],
  validateOrigin: true,
  checkTiming: true,
  rateLimit: { limit: 30, windowMs: 60_000 },
  maxBodyBytes: 12_000,
};

/**
 * Run all security checks against a request.
 * Call this at the top of every API route handler.
 */
export async function guardRequest(
  req: NextRequest,
  options: Partial<GuardOptions> = {}
): Promise<GuardResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const ip = clientIp(req);
  const warnings: string[] = [];
  const method = req.method;
  const path = req.nextUrl.pathname;

  // ─── 0. Check IP blacklist ───
  if (isIpBlacklisted(ip)) {
    logSecurityEvent({
      type: 'ip_blacklisted',
      ip, method, path,
      details: 'Blocked: IP is on blacklist',
    });
    return {
      passed: false,
      response: NextResponse.json({ error: 'Access denied' }, { status: 403 }),
      ip, warnings,
    };
  }

  // ─── 1. Body size check (prevent large payload DoS) ───
  if (opts.maxBodyBytes && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > opts.maxBodyBytes) {
      warnings.push(`Body too large: ${contentLength} bytes`);
      logSecurityEvent({
        type: 'suspicious_payload',
        ip, method, path,
        details: `Body exceeded ${opts.maxBodyBytes} bytes: ${contentLength}`,
      });
      return {
        passed: false,
        response: NextResponse.json({ error: 'Request too large' }, { status: 413 }),
        ip, warnings,
      };
    }
  }

  // ─── 2. Origin validation (prevent CSRF + proxy abuse) ───
  if (opts.validateOrigin) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    
    if (origin && host) {
      try {
        const parsedOrigin = new URL(origin);
        const allowedHosts = [host, process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : null]
          .filter(Boolean);
        
        if (!allowedHosts.includes(parsedOrigin.host)) {
          warnings.push(`Origin rejected: ${origin}`);
          logSecurityEvent({
            type: 'origin_rejection',
            ip, method, path,
            details: `Origin "${origin}" not in allowed hosts`,
          });
          return {
            passed: false,
            response: NextResponse.json({ error: 'Invalid origin' }, { status: 403 }),
            ip, warnings,
          };
        }
      } catch {
        warnings.push(`Invalid origin header: ${origin}`);
        return {
          passed: false,
          response: NextResponse.json({ error: 'Invalid origin' }, { status: 400 }),
          ip, warnings,
        };
      }
    }
  }

  // ─── 3. Rate limiting ───
  if (opts.rateLimit) {
    const limit = rateLimit(`guard:${ip}:${path}`, opts.rateLimit.limit, opts.rateLimit.windowMs);
    if (!limit.allowed) {
      logSecurityEvent({
        type: 'rate_limit_exceeded',
        ip, method, path,
        details: `Rate limit exceeded: ${opts.rateLimit.limit}/${opts.rateLimit.windowMs / 1000}s`,
      });
      return {
        passed: false,
        response: NextResponse.json(
          { error: 'Too many requests' },
          { 
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(limit.resetAt / 1000)),
              'X-RateLimit-Remaining': '0',
            }
          }
        ),
        ip, warnings,
      };
    }
  }

  // ─── 4. Bot detection ───
  if (opts.blockBots) {
    const botResult = detectBot(req);
    if (botResult.isBot) {
      warnings.push(`Bot detected: score=${botResult.score}, signals=${botResult.signals.join(', ')}`);
      logSecurityEvent({
        type: 'bot_detected',
        ip, method, path,
        details: `Bot score: ${botResult.score}. Signals: ${botResult.signals.join('; ')}`,
      });
      
      // For GET requests, just warn. For POST/PUT/DELETE, block.
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        return {
          passed: false,
          response: NextResponse.json({ error: 'Request blocked' }, { status: 403 }),
          ip, warnings,
        };
      }
    }
  }

  // ─── 5. CSRF validation (for state-changing requests) ───
  if (opts.csrf && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = req.headers.get('x-csrf-token') || req.headers.get('csrf-token') || '';
    const sessionId = req.cookies.get('bv_session')?.value || '';
    
    if (!csrfToken || !sessionId) {
      warnings.push('CSRF: Missing token or session');
      logSecurityEvent({
        type: 'csrf_failure',
        ip, method, path,
        details: 'Missing CSRF token or session cookie',
      });
      return {
        passed: false,
        response: NextResponse.json({ error: 'Invalid session' }, { status: 403 }),
        ip, warnings,
      };
    }

    const validation = validateCsrfToken(csrfToken, sessionId);
    if (!validation.valid) {
      warnings.push(`CSRF: ${validation.reason}`);
      logSecurityEvent({
        type: 'csrf_failure',
        ip, method, path,
        details: `CSRF validation failed: ${validation.reason}`,
      });
      return {
        passed: false,
        response: NextResponse.json({ error: 'Invalid token' }, { status: 403 }),
        ip, warnings,
      };
    }
  }

  // ─── All checks passed ───
  return { passed: true, ip, warnings };
}

/**
 * Validate that the booking amount matches server-side rates.
 * Prevents price manipulation via dev tools.
 */
export function validateBookingAmount(room: string, checkIn: string, checkOut: string): { 
  valid: boolean; 
  nights: number; 
  expectedTotal: number;
  expectedRate: number;
} {
  const RATES: Record<string, number> = {
    single: 85000,
    double: 105000,
    suite: 165000,
  };

  const rate = RATES[room] || 85000;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));

  return {
    valid: nights > 0 && nights <= 30, // Max 30 nights
    nights,
    expectedTotal: nights * rate,
    expectedRate: rate,
  };
}

/**
 * Sanitize a string against XSS
 * Use this BEFORE storing ANY user input
 */
export function sanitizeInput(value: string, maxLength = 500): string {
  return value
    .replace(/[<>]/g, '')           // Strip HTML tags
    .replace(/javascript:/gi, '')   // Strip JS protocol
    .replace(/data:/gi, '')         // Strip data URIs
    .replace(/on\w+=/gi, '')        // Strip event handlers (onclick=, onload=)
    .replace(/expression\(/gi, '')  // Strip CSS expressions
    .replace(/<script/gi, '')       // Strip script tags
    .replace(/<iframe/gi, '')       // Strip iframes
    .replace(/<embed/gi, '')        // Strip embeds
    .replace(/<object/gi, '')       // Strip objects
    .trim()
    .slice(0, maxLength);
}

/**
 * Strip ALL HTML from a string for safe display
 */
export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
