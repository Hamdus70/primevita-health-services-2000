import { getAuth } from '@/lib/auth/firebase-admin';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

export async function getCurrentUser() {
  const token = (await headers()).get('Authorization')?.split('Bearer ')[1];
  if (!token) return null;
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const user = await (prisma as any).user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user) {
        return { ...decodedToken, id: decodedToken.uid };
    }
    return { ...decodedToken, ...user };
  } catch (error) {
    return null;
  }
}
