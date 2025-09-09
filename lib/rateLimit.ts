type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimitKey(ip: string, route: string) {
  return `${route}:${ip}`;
}

export function checkRateLimit(ip: string, route: string, limit = 10, intervalMs = 60_000) {
  const key = rateLimitKey(ip, route);
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    buckets.set(key, bucket);
  }

  // refill
  const elapsed = now - bucket.lastRefill;
  if (elapsed > intervalMs) {
    const refills = Math.floor(elapsed / intervalMs);
    bucket.tokens = Math.min(limit, bucket.tokens + refills * limit);
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) {
    return { allowed: false } as const;
  }

  bucket.tokens -= 1;
  return { allowed: true } as const;
}


