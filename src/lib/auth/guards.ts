import { getAuth } from '@/lib/auth/firebase-admin';
import { headers } from 'next/headers';
import { AuthenticationError, AuthorizationError } from '@/lib/api/errors';
import { prisma } from '@/lib/db/prisma';

export async function requireAuth() {
  const token = (await headers()).get('Authorization')?.split('Bearer ')[1];
  if (!token) throw new AuthenticationError('No token provided');
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const user = await (prisma as any).user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user) {
        return { ...decodedToken, id: decodedToken.uid };
    }
    return { ...decodedToken, ...user };
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
}

export async function requireStaff() {
  const user = await requireAuth();
  const staffRoles = ['NURSE', 'DOCTOR', 'CAREGIVER', 'PHYSIOTHERAPIST', 'ADMIN'];
  if (!staffRoles.includes(user.role)) {
      throw new AuthorizationError('Unauthorized: Staff access required');
  }
  return user;
}
