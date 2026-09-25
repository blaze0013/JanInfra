import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import SidebarLayout from '@/components/SidebarLayout';

export default async function AnalystLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user || user.role !== 'ANALYST') {
    redirect('/login');
  }
  
  const lang = user.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst;
  const commonDict = getDictionary(lang).common;

  const navLinks = (
    <>
      <Link href="/analyst" className="block px-3 py-2 rounded hover:bg-slate-800">{dict.dashboard || "Dashboard"}</Link>
      <Link href="/analyst/hotspots" className="block px-3 py-2 rounded hover:bg-slate-800">{dict.hotspots || "Hotspots"}</Link>
      <Link href="/analyst/demand-supply" className="block px-3 py-2 rounded hover:bg-slate-800 text-blue-300 font-medium">{dict.demandSupply || "Demand vs Supply"}</Link>
      <Link href="/analyst/trends" className="block px-3 py-2 rounded hover:bg-slate-800 text-blue-300 font-medium">{dict.demandTrends || "Demand Trends"}</Link>
      <Link href="/analyst/scenarios" className="block px-3 py-2 rounded hover:bg-slate-800 text-blue-300 font-medium">{dict.scenarioAnalysis || "Scenario Analysis"}</Link>
      <Link href="/analyst/recommendations" className="block px-3 py-2 rounded hover:bg-slate-800">{dict.recommendations || "Recommendations"}</Link>
    </>
  );

  return (
    <SidebarLayout
      email={user.email}
      title={dict.title || "JanInfra Analyst"}
      sidebarColorClass="bg-slate-900"
      borderColorClass="border-slate-700"
      navLinks={navLinks}
      commonDict={commonDict}
    >
      {children}
    </SidebarLayout>
  );
}
