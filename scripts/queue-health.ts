import IORedis from 'ioredis';
import { env } from '../src/lib/config/env';

async function checkQueueHealth() {
  console.log('Checking Redis connection for queues...');
  
  if (!env.REDIS_URL) {
    console.error('REDIS_URL is strictly required.');
    process.exit(1);
  }

  const redis = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    connectTimeout: 5000,
  });

  try {
    await redis.ping();
    console.log('✅ Redis is reachable.');

    // We could add deeper BullMQ queue metric checks here
    // e.g., checking queue.getWaitingCount(), etc.
    console.log('✅ Queue system is ready.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Redis connection failed.', error);
    process.exit(1);
  } finally {
    redis.disconnect();
  }
}

if (require.main === module) {
  checkQueueHealth();
}
