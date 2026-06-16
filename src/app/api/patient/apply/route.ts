import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuth } from '@/lib/auth/firebase-admin';
import { SequenceService } from '@/services/identity/sequence.service';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth/password';
import { sendEmail } from '@/services/emailService';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        const body = await req.json();
        console.log('API application body:', JSON.stringify(body));
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

        return await prisma.$transaction(async (tx) => {
            console.log('Starting patient application transaction');
            // 1. Create Patient Application (Auto-Approved)
            const application = await tx.patientApplication.create({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone_number: phone,
                    date_of_birth: new Date(dateOfBirth),
                    residential_address: address,
                    emergency_contact_name: emergencyName,
                    emergency_contact_phone: emergencyPhone,
                    emergency_contact_relation: emergencyRelation,
                    approval_status: 'APPROVED'
                }
            });
            console.log('Patient Application created:', application.id);

            // 2. Generate Username (CL-[INITIALS]-0001)
            const seq = await SequenceService.getNextSequence('PATIENT', tx);
            const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
            const username = `CL-${initials}-${seq.toString().padStart(4, '0')}`;
            console.log('Generated username:', username);

            // 3. Create Patient Record
            const patient = await tx.patient.create({
                data: {
                    patient_username: username,
                    first_name: firstName,
                    last_name: lastName,
                    date_of_birth: new Date(dateOfBirth),
                    age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
                    gender: 'UNKNOWN', // Placeholder requirement
                    phone_number: phone,
                    email,
                    residential_address: address,
                    city: 'UNKNOWN',
                    state: 'UNKNOWN',
                    country: 'UNKNOWN',
                    nationality: 'UNKNOWN',
                }
            });
            console.log('Patient record created:', patient.id);

            // 4. Create User Credentials
            const tempPassword = generateTemporaryPassword();
            const hashedPassword = await hashPassword(tempPassword);

            await tx.userCredential.create({
                data: {
                    linked_user_type: 'PATIENT',
                    patient_id: patient.id,
                    username,
                    password_hash: hashedPassword,
                }
            });
            console.log('UserCredential created for username:', username);
            
            await sendEmail({
                to: 'primevitahealthservices@gmail.com',
                subject: 'New Patient Application',
                text: `New patient application submitted: ${firstName} ${lastName}`,
                html: `<p>New patient application submitted: <strong>${firstName} ${lastName}</strong></p>`
            });

            return NextResponse.json({ 
                message: 'Application approved and credentials generated',
                credentials: { username, tempPassword }
            });
        });
    } catch (error: any) {
        console.error('Application submission error detailed:', error);
        return NextResponse.json({ error: 'Failed to submit application: ' + (error.message || error) }, { status: 500 });
    }
}
