import { auth, adminInstance } from '../src/lib/auth/firebase-admin';

async function testFirebase() {
  console.log('--- Firebase Admin Diagnostic Test ---');
  console.log('Project ID:', adminInstance.app().options.projectId);
  
  try {
    // 1. Verify Auth access
    console.log('Testing auth() access...');
    const userCount = await auth.listUsers(1);
    console.log('Auth check: OK');

    // 2. Test Create/Delete User
    const testEmail = `temp-${Date.now()}@example.com`;
    console.log(`Creating test user: ${testEmail}...`);
    const userRecord = await auth.createUser({
        email: testEmail,
        password: 'password123',
    });
    console.log(`User created: ${userRecord.uid}`);
    
    console.log('Deleting test user...');
    await auth.deleteUser(userRecord.uid);
    console.log('User deleted: OK');

    console.log('--- All Firebase tests PASSED ---');
  } catch (error) {
    console.error('--- Firebase tests FAILED ---');
    console.error(error);
  }
}

testFirebase();
