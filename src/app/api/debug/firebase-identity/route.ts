import { NextResponse } from 'next/server';
import { adminInstance } from '@/lib/auth/firebase-admin';

export async function GET() {
  try {
    const app = adminInstance.app();
    const diagnosticData = {
      projectId: app.options.projectId,
      initialized: true,
      credentialSource: 'Unknown (Explicit or ApplicationDefault)',
      authAccessible: false,
      error: null as any
    };

    try {
      const auth = app.auth();
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
