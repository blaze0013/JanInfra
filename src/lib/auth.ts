import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }
  
  // Set simple session cookie (expires when browser closes)
  (await cookies()).set('session', user.id, { httpOnly: true, path: '/' });
  return user;
}

export async function logout() {
  (await cookies()).delete('session');
}

export async function getUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  if (!sessionId) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    include: { citizenProfile: true }
  });
  
  if (user) {
    const localeOverride = cookieStore.get('LOCALE')?.value;
    if (localeOverride) {
      if (!user.citizenProfile) (user as any).citizenProfile = {};
      (user as any).citizenProfile.languagePreference = localeOverride;
    }
  }

  return user;
}
