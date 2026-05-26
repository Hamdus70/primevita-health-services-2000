import Redis, { RedisOptions } from "ioredis";

export const redisConnectionOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    // Stop retrying to avoid spamming the log in environments without Redis
    return null;
  }
};

// Global redis connection instances for re-use
let sharedConnection: Redis | null = null;
let connectionAttempted = false;

export function getRedisConnection(): Redis | null {
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    if (!connectionAttempted) {
      console.info('Redis not configured, skipping connection.');
      connectionAttempted = true;
    }
    return null;
  }

  if (!sharedConnection) {
    sharedConnection = new Redis(redisConnectionOptions);
    sharedConnection.on('error', (err) => {
      console.warn('Redis connection error:', err.message);
    });
  }
  return sharedConnection;
}
