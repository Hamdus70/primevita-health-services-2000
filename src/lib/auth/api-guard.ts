import { getAuth } from '@/lib/auth/firebase-admin';

export async function verifyToken(req: Request) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return null;

  try {
    return await getAuth().verifyIdToken(token);
  } catch (error) {
    return null;
  }
}
