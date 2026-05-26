import { getRedisConnection } from '@/lib/jobs/redis';

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  try {
    const redis = getRedisConnection();
    if (!redis) {
      // Fail open if Redis is unavailable
      return {
        allowed: true,
        remaining: 1,
        resetAt: new Date(Date.now() + windowSeconds * 1000),
      };
    }
    
    const currentCount = await redis.incr(key);
    if (currentCount === 1) {
      await redis.expire(key, windowSeconds);
    }
    
    const ttl = await redis.ttl(key);
    const resetTimestamp = Date.now() + (ttl > 0 ? ttl : windowSeconds) * 1000;
    
    return {
      allowed: currentCount <= limit,
      remaining: Math.max(0, limit - currentCount),
      resetAt: new Date(resetTimestamp),
    };
  } catch (error) {
    // Fail open if Redis is unavailable so we don't break the app
    console.warn('Rate limiting failure (Redis unavailable), failing open:', error);
    return {
      allowed: true,
      remaining: 1,
      resetAt: new Date(Date.now() + windowSeconds * 1000),
    };
  }
}

