import bcrypt from 'bcrypt';

export function generateTemporaryPassword(): string {
  return `P@${Math.random().toString(36).slice(-8)}`;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}
