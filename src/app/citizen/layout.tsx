import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import BackButton from '@/components/BackButton';

import { getDictionary } from '@/lib/i18n';

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user || user.role !== 'CITIZEN') {
    redirect('/login');
  }

  const lang = user.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).citizen;
  const commonDict = getDictionary(lang).common;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-4">
          <BackButton showText={false} colorClass="text-white hover:text-gray-200" />
          <h1 className="text-xl font-bold">{dict.title || "JanInfra Insight - Citizen"}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/citizen" className="hover:underline">{dict.dashboard || "Dashboard"}</Link>
          <Link href="/citizen/submit" className="bg-white text-blue-900 px-3 py-1 rounded font-medium">{dict.newRequest || "New Request"}</Link>
          <UserMenu email={user.email} dict={commonDict} />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
