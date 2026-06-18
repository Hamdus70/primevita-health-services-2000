import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/auth/firebase-admin';
import { sendEmail } from '@/services/emailService';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const app = getAdminApp();
        const auth = app.auth();
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        const body = await req.json();
        const {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            address,
            emergencyName,
            emergencyPhone,
            emergencyRelation,
        } = body;

        const db = app.firestore();
        
        // 1. Create Patient Application
        const applicationRef = await db.collection('patient_applications').add({
            first_name: firstName,
            last_name: lastName,
            email,
            phone_number: phone,
            date_of_birth: dateOfBirth,
            residential_address: address,
            emergency_contact_name: emergencyName,
            emergency_contact_phone: emergencyPhone,
            emergency_contact_relation: emergencyRelation,
            approval_status: 'APPROVED',
            createdAt: app.firestore.FieldValue.serverTimestamp()
        });
        console.log('Patient Application created:', applicationRef.id);

        // 2. Generate Username (simplified for demo)
        const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
        const username = `CL-${initials}-${Math.floor(Math.random() * 9000 + 1000)}`;
        
        // 3. Create Patient Record
        const patientRef = await db.collection('patients').doc(uid);
        await patientRef.set({
            patient_username: username,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            phone_number: phone,
            email,
            residential_address: address,
            firebase_uid: uid,
            createdAt: app.firestore.FieldValue.serverTimestamp()
        });
        console.log('Patient record created:', patientRef.id);

        // 4. Send notification
        await sendEmail({
            to: 'primevitahealthservices@gmail.com',
            subject: 'New Patient Application',
            text: `New patient application submitted: ${firstName} ${lastName}`,
            html: `<p>New patient application submitted: <strong>${firstName} ${lastName}</strong></p>`
        });

        return NextResponse.json({ 
            message: 'Application approved',
            credentials: { username } // Placeholder
        });
    } catch (error: any) {
        console.error('Application submission error detailed:', error);
        return NextResponse.json({ error: 'Failed to submit application: ' + (error.message || error) }, { status: 500 });
    }
}
