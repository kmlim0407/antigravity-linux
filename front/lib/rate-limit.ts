/**
 * In-memory sliding window rate limiter.
 *
 * Per-IP limits:
 *   - 10 requests per minute   (burst protection)
 *   - 60 requests per hour     (sustained abuse protection)
 *
 * Global daily limit:
 *   - 100 requests per day across all users (API cost protection)
 */

interface Window {
  timestamps: number[];
}

const minuteWindows = new Map<string, Window>();
const hourWindows = new Map<string, Window>();

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const MAX_PER_MINUTE = 10;
const MAX_PER_HOUR = 60;
const MAX_PER_DAY_GLOBAL = 100;

// Global daily counter
let globalDailyCount = 0;
let globalDayStart = Date.now();

function resetGlobalIfNewDay() {
  const now = Date.now();
  if (now - globalDayStart >= DAY_MS) {
    globalDailyCount = 0;
    globalDayStart = now;
  }
}

// Periodically purge stale per-IP entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, w] of minuteWindows) {
    w.timestamps = w.timestamps.filter((t) => now - t < MINUTE_MS);
    if (w.timestamps.length === 0) minuteWindows.delete(key);
  }
  for (const [key, w] of hourWindows) {
    w.timestamps = w.timestamps.filter((t) => now - t < HOUR_MS);
    if (w.timestamps.length === 0) hourWindows.delete(key);
  }
}, 5 * 60_000);

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number; reason: "minute" | "hour" | "daily" };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  // --- global daily limit ---
  resetGlobalIfNewDay();
  if (globalDailyCount >= MAX_PER_DAY_GLOBAL) {
    const msUntilReset = DAY_MS - (now - globalDayStart);
    return { allowed: false, retryAfterMs: msUntilReset, reason: "daily" };
  }

  // --- per-IP minute window ---
  let mw = minuteWindows.get(ip);
  if (!mw) {
    mw = { timestamps: [] };
    minuteWindows.set(ip, mw);
  }
  mw.timestamps = mw.timestamps.filter((t) => now - t < MINUTE_MS);
  if (mw.timestamps.length >= MAX_PER_MINUTE) {
    const oldest = mw.timestamps[0];
    return { allowed: false, retryAfterMs: MINUTE_MS - (now - oldest), reason: "minute" };
  }

  // --- per-IP hour window ---
  let hw = hourWindows.get(ip);
  if (!hw) {
    hw = { timestamps: [] };
    hourWindows.set(ip, hw);
  }
  hw.timestamps = hw.timestamps.filter((t) => now - t < HOUR_MS);
  if (hw.timestamps.length >= MAX_PER_HOUR) {
    const oldest = hw.timestamps[0];
    return { allowed: false, retryAfterMs: HOUR_MS - (now - oldest), reason: "hour" };
  }

  // Record this request
  mw.timestamps.push(now);
  hw.timestamps.push(now);
  globalDailyCount += 1;
  return { allowed: true };
}
