
import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth/firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let session: any;
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    // In a real app, you would fetch user data from DB using decodedToken.uid
    // For this example, we assume decodedToken contains enough info or mapping is done.
    session = { user: { linkedUserType: 'STAFF', staffId: decodedToken.uid } }; 
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!session || !session.user || session.user.linkedUserType !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = session.user.staffId;
  if (!staffId) {
    return NextResponse.json({ error: 'Invalid staff session' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { fullName, email, age, phone, department, passportPhotoUrl } = body;

    // Basic validation
    if (!fullName || !email || !age) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Split fullName into first_name and last_name roughly
    const nameParts = fullName.split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ');

    await prisma.staff.update({
      where: { id: staffId },
      data: {
        first_name,
        last_name,
        email,
        age: parseInt(age),
        phone_number: phone,
        // Assuming passport_photo_url is stored here:
        passport_photo_url: passportPhotoUrl,
        onboarding_completed: true,
      }
    });

    return NextResponse.json({ message: 'Profile completed successfully' });
  } catch (error) {
    console.error('Onboarding failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
