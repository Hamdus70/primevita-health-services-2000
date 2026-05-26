import { test, expect } from '@playwright/test';
import { prisma } from '../../src/lib/db/prisma';
import { auth } from '../../src/lib/auth/firebase-admin';

test.describe('Registration Flow', () => {
  test('should register a new patient and verify in DB and Firebase', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testFullName = 'John Doe';
    const testPhone = '1234567890';
    const testDOB = '1990-01-01';

    // 1. Fill registration form
    await page.goto('/patient/onboarding');
    await page.fill('input[name="fullName"]', testFullName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', testPhone);
    await page.fill('input[name="dateOfBirth"]', testDOB);
    await page.click('button[type="submit"]');

    // 2. Wait for credentials page
    await expect(page.locator('text=Your Credentials')).toBeVisible();
    
    // Get username and password from UI if needed, but we verify through backend for now.
    // Let's just confirm we are on the credentials page.
    await expect(page).toHaveURL(/.*onboarding\/page/); // Adjust based on actual URL

    // 3. Verify in Firebase Auth
    const userRecord = await auth.getUserByEmail(testEmail);
    expect(userRecord).toBeDefined();
    expect(userRecord.email).toBe(testEmail);

    // 4. Verify in PostgreSQL
    const patient = await prisma.patient.findUnique({
      where: {
        firebase_uid: userRecord.uid,
      },
    });
    expect(patient).toBeDefined();
    expect(patient?.email).toBe(testEmail);
    expect(patient?.first_name).toBe('John');
    expect(patient?.last_name).toBe('Doe');
  });
});
