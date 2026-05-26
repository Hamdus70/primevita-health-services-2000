// Preflight checks before deployment

import { validateEnv } from './validate-env';
import { validateIntegrations } from './validate-integrations';

async function preflightCheck() {
  console.log('--- STARTING PREFLIGHT CHECK ---');

  const envPassed = validateEnv();
  console.log(`Environment variables check ${envPassed ? 'PASSED' : 'FAILED'}`);

  const intPassed = await validateIntegrations();
  console.log(`Integrations check ${intPassed ? 'PASSED' : 'FAILED'}`);

  if (envPassed && intPassed) {
    console.log('--- ALL PREFLIGHT CHECKS PASSED ---');
    process.exit(0);
  } else {
    console.error('--- PREFLIGHT CHECKS FAILED ---');
    process.exit(1);
  }
}

if (require.main === module) {
  preflightCheck();
}
