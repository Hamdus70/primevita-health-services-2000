import { execSync } from 'child_process';
import { env } from '../src/lib/config/env';

function backupDatabase() {
  console.log('--- Database Backup Process Started ---');

  if (!env.DATABASE_URL) {
    console.error('DATABASE_URL is required to perform a backup.');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = `backup-${timestamp}.sql.gz`;

  const pgDumpCmd = `pg_dump "${env.DATABASE_URL}" | gzip > ${backupFilename}`;

  try {
    console.log(`Executing backup command...`);
    execSync(pgDumpCmd, { stdio: 'inherit' });
    console.log(`✅ Database backup successfully saved to ${backupFilename}`);
  } catch (error) {
    console.error('❌ Database backup failed.', error);
    process.exit(1);
  }
}

if (require.main === module) {
  backupDatabase();
}
