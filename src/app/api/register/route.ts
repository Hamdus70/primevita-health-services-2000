import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/firebase-admin';
import { z } from 'zod';
import crypto from 'crypto';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.issues[0].message }, { status: 400 });
    }

    const { fullName, email, phone, dateOfBirth } = validatedData.data;

    // Secure password generation
    const password = crypto.randomBytes(12).toString('hex');
    
    // Split name for initials
    const nameParts = fullName.split(' ');
    const initials = nameParts.map(p => p[0].toUpperCase()).join('').substring(0, 2);

    // 1. Generate sequential username
    const seq = await prisma.patientSequence.upsert({
        where: { id: 1 },
        update: { last_number: { increment: 1 } },
        create: { id: 1, last_number: 1 }
    });
    const username = `CL-${initials}-${seq.last_number.toString().padStart(4, '0')}`;

    // 2. Create Firebase Auth User
    let firebaseUser;
    try {
      console.log('Attempting to create Firebase Auth user:', email);
      firebaseUser = await auth.createUser({
        email,
        password,
        displayName: fullName,
        phoneNumber: phone,
      });
      console.log('Firebase Auth user created successfully:', firebaseUser.uid);
    } catch (firebaseError: any) {
      console.error('Firebase Auth creation failed:', firebaseError);
      throw firebaseError;
    }

    // 3. Create User record in PostgreSQL
    const [first_name, ...last_name_parts] = fullName.split(' ');
    const last_name = last_name_parts.join(' ') || 'User';

    try {
      console.log('Attempting to create Patient record in Prisma with data:', JSON.stringify({
        firebase_uid: firebaseUser.uid,
        first_name,
        last_name,
        email,
        phone_number: phone,
        date_of_birth: new Date(dateOfBirth),
        patient_username: username,
        age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
        gender: 'Not Specified',
        residential_address: 'Not Specified',
        city: 'Not Specified',
        state: 'Not Specified',
        country: 'Not Specified',
        nationality: 'Not Specified',
      }, null, 2));
      
      const patient = await prisma.patient.create({
        data: {
          firebase_uid: firebaseUser.uid,
          first_name,
          last_name,
          email,
          phone_number: phone,
          date_of_birth: new Date(dateOfBirth),
          patient_username: username,
          age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
          gender: 'Not Specified',
          residential_address: 'Not Specified',
          city: 'Not Specified',
          state: 'Not Specified',
          country: 'Not Specified',
          nationality: 'Not Specified',
        },
      });
      console.log('Patient record created successfully with PostgreSQL ID:', patient.id);
    } catch (prismaError: any) {
      console.error('Prisma patient creation failed, rolling back Firebase user:', prismaError);
      // Rollback Firebase User
      try {
        await auth.deleteUser(firebaseUser.uid);
        console.log('Firebase user rolled back successfully');
      } catch (rollbackError) {
        console.error('Failed to rollback Firebase user:', rollbackError);
      }
      throw prismaError;
    }

    return NextResponse.json({ username, password }, { status: 201 });
  } catch (error: any) {
    console.error('Registration API final catch block:', error);
    
    // Firebase Admin error check
    const errorCode = error.code || error.errorInfo?.code;
    const errorMessage = error.message || '';

    if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('EMAIL_EXISTS')) {
      return NextResponse.json(
        { error: 'Email is already registered. Please log in or use a different email.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Registration failed. Please try again later.' },
      { status: 500 }
    );
  }
}
