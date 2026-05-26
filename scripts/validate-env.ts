// Validate required environment variables
const REQUIRED_VARS = [
  'DATABASE_URL',
  'REDIS_URL',
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'RESEND_API_KEY',
  'TERMII_API_KEY',
  'GEMINI_API_KEY',
  'NEXT_PUBLIC_GEMINI_API_KEY'
];

function validateEnv() {
  const missing = [];
  const defaults = [];

  for (const envVar of REQUIRED_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    } else if (process.env[envVar] === 'your_default_string_or_placeholder') {
      defaults.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing.join(', '));
  }

  if (defaults.length > 0) {
    console.warn('Environment variables with default values:', defaults.join(', '));
  }

  if (missing.length === 0 && defaults.length === 0) {
    console.log('Environment variable validation passed.');
  }

  return missing.length === 0 && defaults.length === 0;
}

if (require.main === module) {
  const success = validateEnv();
  process.exit(success ? 0 : 1);
}

export { validateEnv };
