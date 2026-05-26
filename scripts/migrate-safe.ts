import { execSync } from 'child_process';
import { env } from '../src/lib/config/env';

function migrateSafe() {
  console.log('--- Safe Production Migration Process ---');

  if (process.env.MAINTENANCE_MODE !== 'true') {
    console.warn('⚠️ WARNING: App is not in maintenance mode.');
    console.warn('Set MAINTENANCE_MODE=true before running production migrations.');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = `pre-migration-backup-${timestamp}.sql.gz`;

  console.log('1. Creating pre-migration backup...');
  try {
    const pgDumpCmd = `pg_dump "${env.DATABASE_URL}" | gzip > ${backupFilename}`;
    execSync(pgDumpCmd, { stdio: 'inherit' });
    console.log(`✅ Backup saved to ${backupFilename}`);
  } catch (error) {
    console.error('❌ Backup failed. Aborting migration to guarantee data safety.');
    process.exit(1);
  }

  console.log('2. Applying Prisma migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations applied successfully.');
    console.log('🎉 Please disable MAINTENANCE_MODE to resume live traffic.');
  } catch (error) {
    console.error('❌ Migration failed.');
    console.error('⚠️ ALERT: Automatic rollback disabled to prevent unintended data loss.');
    console.error(`⚠️ A valid backup exists: ${backupFilename}`);
    console.error('⚠️ Please investigate the failure and restore manually if needed.');
    process.exit(1); // Fail the pipeline
  }
}

if (require.main === module) {
  migrateSafe();
}
