import * as firebaseAdmin from 'firebase-admin';
import config from '../../../firebase-applet-config.json';
const admin = (firebaseAdmin as any).default || firebaseAdmin;

console.log(`Firebase Admin initialized, SDK version: ${admin.SDK_VERSION || 'unknown'}`);
console.log(`Using Project ID: ${config.projectId}`);

let app: any;

try {
  const apps = (admin.apps || []);
  
  if (apps.length === 0) {
    console.log('Starting Firebase Admin initialization with explicit credentials...');
    
    let credential;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    } else {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable must be set with Service Account JSON content');
    }

    app = admin.initializeApp({
      credential,
      projectId: config.projectId,
    });
    console.log('Firebase Admin initialized successfully with explicit credentials.');
  } else {
    console.log('Firebase Admin already initialized.');
    app = apps[0];
  }
} catch (error) {
  console.error('Firebase Admin initialization failed:', error);
  throw error;
}

export const auth = app.auth();
export const adminInstance = admin;
