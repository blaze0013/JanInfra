import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import SidebarLayout from '@/components/SidebarLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  const lang = user.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).admin;
  const commonDict = getDictionary(lang).common;

  const navLinks = (
    <>
      <Link href="/admin" className="block px-3 py-2 rounded hover:bg-red-800">{dict.dashboard || "Dashboard"}</Link>
      <Link href="/admin/recommendations" className="block px-3 py-2 rounded hover:bg-red-800">{dict.recommendations || "Recommendations"}</Link>
      <Link href="/admin/datasets" className="block px-3 py-2 rounded hover:bg-red-800">{dict.manageDatasets || "Manage Datasets"}</Link>
    </>
  );

  return (
    <SidebarLayout
      email={user.email}
      title={dict.title || "JanInfra Admin"}
      sidebarColorClass="bg-red-900"
      borderColorClass="border-red-700"
      navLinks={navLinks}
      commonDict={commonDict}
    >
      {children}
    </SidebarLayout>
  );
}
