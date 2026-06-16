import * as firebaseAdmin from 'firebase-admin';
import config from '../../../firebase-applet-config.json';
const admin = (firebaseAdmin as any).default || firebaseAdmin;

let app: any;

function initApp() {
  if (!app) {
    const apps = (admin.apps || []);
    
    if (apps.length === 0) {
      const credential = process.env.FIREBASE_SERVICE_ACCOUNT ? 
          admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) :
          admin.credential.applicationDefault();
      
      app = admin.initializeApp({
        credential,
        projectId: config.projectId,
      });
      console.log('Firebase Admin initialized successfully.');
    } else {
      app = apps[0];
    }
  }
}

export function getAuth() {
  initApp();
  return app.auth();
}

export function getAdminApp() {
  initApp();
  return app;
}

export const adminInstance = admin;
