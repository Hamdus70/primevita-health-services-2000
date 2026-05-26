const fs = require('fs');
const dirs = [
  'src/app/(patient)/patient/overview',
  'src/app/(patient)/patient/profile',
  'src/app/(patient)/patient/onboarding',
  'src/app/(patient)/patient/appointments',
  'src/app/(patient)/patient/vitals',
  'src/app/(patient)/patient/care-plans',
  'src/app/(patient)/patient/medications',
  'src/app/(patient)/patient/billing',
  'src/app/(patient)/patient/announcements',
  'src/app/(patient)/patient/documents',
  'src/app/(patient)/patient/ai-insights',
  'src/app/(patient)/patient/settings'
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});
console.log('Directories created');
