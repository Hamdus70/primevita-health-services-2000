import { execSync } from 'child_process';
import { env } from '../src/lib/config/env';

function restoreDatabase() {
  console.log('--- Database Restore Process Started ---');

  const args = process.argv.slice(2);
  const backupFile = args[0];
  const confirm = args.includes('--confirm');

  if (!backupFile) {
    console.error('Please provide a backup file to restore. Usage: npm run db:restore <filename> --confirm');
    process.exit(1);
  }

  if (!confirm) {
    console.warn('⚠️ WARNING: This will overwrite the current database.');
    console.warn('Please append --confirm to proceed.');
    process.exit(1);
  }

  if (!env.DATABASE_URL) {
    console.error('DATABASE_URL is required to perform a restore.');
    process.exit(1);
  }

  const pgRestoreCmd = `gunzip -c ${backupFile} | psql "${env.DATABASE_URL}"`;

  try {
    console.log(`Restoring database from ${backupFile}...`);
    execSync(pgRestoreCmd, { stdio: 'inherit' });
    console.log(`✅ Database restore completed successfully.`);
  } catch (error) {
    console.error('❌ Database restore failed.', error);
    process.exit(1);
  }
}

if (require.main === module) {
  restoreDatabase();
}
