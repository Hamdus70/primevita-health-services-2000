import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/firebase-admin';
import * as admin from 'firebase-admin';

export async function GET() {
  const diagnostics = {
    initialized: !!admin.apps && admin.apps.length > 0,
    appCount: admin.apps ? admin.apps.length : 0,
    authAccessible: !!auth,
    sdkVersion: admin.SDK_VERSION || 'unknown'
  };

  return NextResponse.json(diagnostics);
}
