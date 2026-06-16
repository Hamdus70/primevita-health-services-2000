import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuth } from '@/lib/auth/firebase-admin';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        
        const patient = await prisma.patient.findUnique({
            where: { email: decodedToken.email! },
            select: {
                id: true,
                quick_assessment_completed: true
            }
        });
        
        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }
        
        return NextResponse.json({ patient });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }
}
