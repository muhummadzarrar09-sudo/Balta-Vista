/**
 * Security Event Auditor
 * 
 * Logs every security-relevant event so we can:
 *   1. Detect attack patterns
 *   2. Build IP blacklists
 *   3. Provide evidence if a dispute arises
 *   4. Monitor for fraud
 */

import fs from 'node:fs';
import path from 'node:path';

export type SecurityEventType = 
  | 'csrf_failure'
  | 'origin_rejection'
  | 'rate_limit_exceeded'
  | 'bot_detected'
  | 'honeypot_triggered'
  | 'form_too_fast'
  | 'invalid_reference'
  | 'amount_tampering'
  | 'admin_auth_failure'
  | 'receipt_upload_abuse'
  | 'suspicious_payload'
  | 'ip_blacklisted';

interface SecurityEvent {
  type: SecurityEventType;
  timestamp: string;
  ip: string;
  method: string;
  path: string;
  userAgent?: string;
  reference?: string;
  details: string;
}

const LOG_DIR = path.join(process.cwd(), 'data', 'security');
const LOG_FILE = path.join(LOG_DIR, 'security-events.jsonl');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
  ensureLogDir();
  const entry: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  const line = JSON.stringify(entry) + '\n';
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf-8');
  } catch {
    // Fail silently — logging should never break the app
  }

  // Also log to console in a visible format
  const icon = {
    csrf_failure: '🔒',
    origin_rejection: '🚫',
    rate_limit_exceeded: '⏱️',
    bot_detected: '🤖',
    honeypot_triggered: '🍯',
    form_too_fast: '⚡',
    invalid_reference: '❓',
    amount_tampering: '💰',
    admin_auth_failure: '🔑',
    receipt_upload_abuse: '📎',
    suspicious_payload: '⚠️',
    ip_blacklisted: '⛔',
  }[event.type] || '🔴';

  console.log(`${icon} [SECURITY] ${event.type}: ${event.details.substring(0, 120)} (IP: ${event.ip})`);
}

/**
 * Get recent security events for analysis
 */
export function getRecentSecurityEvents(limit = 50): SecurityEvent[] {
  ensureLogDir();
  if (!fs.existsSync(LOG_FILE)) return [];
  
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf-8');
    const lines = raw.trim().split('\n').filter(Boolean);
    const events = lines.map((line) => JSON.parse(line) as SecurityEvent);
    return events.slice(-limit).reverse();
  } catch {
    return [];
  }
}

/**
 * Check if an IP has been blacklisted
 */
export function isIpBlacklisted(ip: string): boolean {
  const events = getRecentSecurityEvents(200);
  const recentFailures = events.filter(
    (e) => e.ip === ip && e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  );

  // Auto-blacklist: 10+ serious violations in 24 hours
  const seriousTypes: SecurityEventType[] = [
    'csrf_failure', 'origin_rejection', 'honeypot_triggered', 'amount_tampering'
  ];
  const seriousCount = recentFailures.filter((e) => seriousTypes.includes(e.type)).length;

  if (seriousCount >= 10) {
    logSecurityEvent({
      type: 'ip_blacklisted',
      ip,
      method: 'SYSTEM',
      path: '/system',
      details: `Auto-blacklisted: ${seriousCount} serious violations in 24h`,
    });
    return true;
  }

  return false;
}
