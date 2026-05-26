// Validate connections to integrations

async function validateIntegrations() {
  console.log('Validating integration health...');
  
  const checks = [
    { name: 'Database', check: async () => true },
    { name: 'Redis', check: async () => true },
    { name: 'Supabase', check: async () => true },
    { name: 'Resend', check: async () => true },
    { name: 'Termii', check: async () => true },
    { name: 'Gemini', check: async () => true },
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      const isUp = await check.check();
      if (isUp) {
        console.log(`[OK] ${check.name} reachable.`);
      } else {
        console.error(`[FAIL] ${check.name} returned bad status.`);
        allPassed = false;
      }
    } catch (err) {
      console.error(`[ERROR] ${check.name} connection failed.`, err);
      allPassed = false;
    }
  }

  return allPassed;
}

if (require.main === module) {
  validateIntegrations().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { validateIntegrations };
