import { prisma } from "./prisma";

export async function checkDatabaseHealth(): Promise<{ healthy: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    return { healthy: true, latencyMs };
  } catch (error) {
    const latencyMs = Date.now() - start;
    return { healthy: false, latencyMs };
  }
}
