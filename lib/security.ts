/**
 * Security Utilities
 * 
 * Re-exports the hardened security functions for backward compatibility.
 */

import { sanitizeInput as hardSanitize, stripHtml, validateBookingAmount, guardRequest } from '@/lib/security/request-guard';

export { stripHtml, validateBookingAmount, guardRequest };

/**
 * @deprecated Use sanitizeInput from @/lib/security/request-guard directly.
 */
export function sanitizeText(value: string) {
  return hardSanitize(value, 600);
}

/**
 * Sanitize all string values in a booking payload
 */
export function sanitizeBookingPayload<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      typeof value === 'string' ? hardSanitize(value, 600) : value,
    ])
  ) as T;
}

/**
 * Validate that a request origin matches our host (CSRF prevention)
 */
export function isAllowedOrigin(origin: string | null, host: string | null) {
  if (!origin || !host) return true;
  try {
    const parsed = new URL(origin);
    const allowedHosts = [host, process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : null]
      .filter(Boolean);
    return allowedHosts.includes(parsed.host);
  } catch {
    return false;
  }
}
