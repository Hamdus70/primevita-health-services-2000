import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export const getDb = (): Firestore => {
  if (!_db) {
    _db = getFirestore(getFirebase(), firebaseConfig.firestoreDatabaseId);
  }
  return _db;
};

export const getAuthClient = (): Auth => {
  if (!_auth) {
    _auth = getAuth(getFirebase());
  }
  return _auth;
};

// Backward compatibility: Eagerly export these but they will attempt initialization on first access
export const db = getDb();
export const auth = getAuthClient();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
