/**
 * Admin Authentication — shared module for all admin routes.
 * 
 * Uses HttpOnly session cookies only — never URL params.
 * URL param auth (`?key=...`) has been removed.
 */

import { NextRequest } from 'next/server';
import crypto from 'node:crypto';

const ADMIN_KEY = process.env.ADMIN_KEY || '';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

export function verifyAdmin(req: NextRequest): { valid: boolean; reason?: string } {
  // 1. Check Authorization header (for API calls from the admin dashboard)
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const key = authHeader.slice(7);
    if (key === ADMIN_KEY) return { valid: true };
    return { valid: false, reason: 'Invalid authorization header' };
  }

  // 2. Check session cookie (for browser-based admin access)
  const sessionCookie = req.cookies.get('admin_session')?.value;
  if (sessionCookie) {
    try {
      const decoded = Buffer.from(sessionCookie, 'base64url').toString('utf-8');
      const parts = decoded.split(':');
      if (parts.length < 3) return { valid: false, reason: 'Malformed session' };

      const ip = parts[0];
      const timestamp = parseInt(parts[parts.length - 2], 10);
      const signature = parts[parts.length - 1];
      const payload = parts.slice(0, -1).join(':');

      // Check expiry (6 hours)
      if (Date.now() - timestamp > 6 * 60 * 60 * 1000) {
        return { valid: false, reason: 'Session expired' };
      }

      // Verify signature
      const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
      if (signature !== expected) {
        return { valid: false, reason: 'Invalid session signature' };
      }

      return { valid: true };
    } catch {
      return { valid: false, reason: 'Cannot parse session' };
    }
  }

  // 3. No valid auth found
  return { valid: false, reason: 'No authentication provided' };
}
