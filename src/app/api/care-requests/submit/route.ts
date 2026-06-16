import { NextResponse } from 'next/server';
import { adminInstance } from '@/lib/auth/firebase-admin';
import { getAdminApp } from '@/lib/auth/firebase-admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const app = getAdminApp();
        const db = app.firestore();
        await db.collection('care_requests').add({
            ...body,
            status: 'pending_review',
            createdAt: adminInstance.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error saving assessment to Firestore:", error);
        return NextResponse.json({ error: "Failed to save assessment to database" }, { status: 500 });
    }
}
