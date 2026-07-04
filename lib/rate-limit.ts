/**
 * Persisted Rate Limiting
 * 
 * Writes to disk so limits survive server restarts.
 * Cleans up expired entries every write.
 */

import fs from 'node:fs';
import path from 'node:path';

type Bucket = { count: number; resetAt: number };
type Store = Record<string, Bucket>;

const DATA_DIR = path.join(process.cwd(), 'data');
const RATE_LIMIT_FILE = path.join(DATA_DIR, 'rate-limits.json');
const CLEANUP_INTERVAL = 60_000; // Clean expired entries every 60s
let lastCleanup = Date.now();

function readStore(): Store {
  try {
    if (!fs.existsSync(RATE_LIMIT_FILE)) return {};
    const raw = fs.readFileSync(RATE_LIMIT_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(store), 'utf-8');
  } catch {
    // Fail silently — rate limiting should never break the app
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const store = readStore();

  // Periodic cleanup (every 60s)
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now;
    for (const [storeKey, bucket] of Object.entries(store)) {
      if (bucket.resetAt < now) delete store[storeKey];
    }
  }

  const bucket = store[key] ?? { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  store[key] = bucket;

  writeStore(store);

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}
