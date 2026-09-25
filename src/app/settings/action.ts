'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function setLanguage(formData: FormData) {
  const lang = formData.get('language') as string;
  if (lang) {
    const cookieStore = await cookies();
    cookieStore.set('LOCALE', lang, { path: '/' });
    
    const user = await getUser();
    if (user) {
      await prisma.citizenProfile.upsert({
        where: { userId: user.id },
        update: { languagePreference: lang },
        create: { userId: user.id, languagePreference: lang }
      });
    }
  }
  redirect('/settings');
}
