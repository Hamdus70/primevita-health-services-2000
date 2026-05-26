import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkHealth() {
  try {
    console.log('Checking database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database is healthy and reachable.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed.');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  checkHealth();
}
