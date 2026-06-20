import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user || !user.id) {
    throw new Error('Unauthorized: Authentication required');
  }
  return user as typeof user & { id: string };
}
