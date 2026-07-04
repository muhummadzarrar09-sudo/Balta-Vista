/**
 * CSRF Protection — Double-Submit Cookie Pattern
 * 
 * Every state-changing request must include a CSRF token that matches
 * the one set as a cookie. This prevents:
 *   - Cross-site request forgery (attacker.com submitting forms to us)
 *   - Simple POST spam from external tools
 *   - Dev console automated submissions (no cookie access from console)
 */

import { createHmac, randomBytes } from 'node:crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export function generateCsrfToken(sessionId: string): string {
  const data = `${sessionId}:${Date.now()}`;
  const signature = createHmac('sha256', CSRF_SECRET).update(data).digest('hex');
  return Buffer.from(`${data}:${signature}`).toString('base64url');
}

export function validateCsrfToken(token: string, sessionId: string): { valid: boolean; reason?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 3) return { valid: false, reason: 'Malformed token' };

    const timestamp = parseInt(parts[parts.length - 2], 10);
    const signature = parts[parts.length - 1];
    const data = parts.slice(0, -1).join(':');

    // Check expiry
    if (Date.now() - timestamp > TOKEN_TTL_MS) {
      return { valid: false, reason: 'Token expired' };
    }

    // Verify signature
    const expected = createHmac('sha256', CSRF_SECRET).update(data).digest('hex');
    if (!signature || signature !== expected) {
      return { valid: false, reason: 'Invalid signature' };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'Token parse failed' };
  }
}

/**
 * Generate a session ID — stored as HttpOnly cookie, not accessible from JS console
 */
export function generateSessionId(): string {
  return randomBytes(24).toString('hex');
}
