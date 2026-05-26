import { NextResponse } from 'next/server';
import { auth, adminInstance } from '@/lib/auth/firebase-admin';

export async function GET() {
  try {
    const diagnosticData = {
      projectId: adminInstance.app().options.projectId,
      initialized: !!adminInstance.apps.length,
      authAccessible: false,
      credentialSource: 'applicationDefault',
      error: null as any
    };

    try {
      // Light test
      await auth.listUsers(1);
      diagnosticData.authAccessible = true;
    } catch (e: any) {
      diagnosticData.error = {
        code: e.code,
        message: e.message,
      };
    }

    return NextResponse.json(diagnosticData);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
