import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import IORedis from 'ioredis';
import { env } from '@/lib/config/env';

const prisma = new PrismaClient();

export async function GET() {
  const health: Record<string, any> = {
    appVersion: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'up',
    services: {
      database: 'unknown',
      redis: 'unknown',
    }
  };

  // DB Check
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'up';
  } catch (error) {
    health.services.database = 'down';
    health.status = 'degraded';
  }

  // Redis Check
  if (env.REDIS_URL) {
    try {
      const redis = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: 1, connectTimeout: 1000 });
      redis.on('error', () => {}); // Prevent unhandled error crashes
      await redis.ping();
      health.services.redis = 'up';
      redis.disconnect();
    } catch (error) {
      health.services.redis = 'down';
      health.status = 'degraded';
    }
  }

  const statusCode = health.status === 'up' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
