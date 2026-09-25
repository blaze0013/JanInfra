import { prisma } from '@/lib/db';

import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

import AdminIssuesTabs from '@/components/AdminIssuesTabs';

export default async function AdminDashboard() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).admin;

  const users = await prisma.user.count();
  const datasets = await prisma.datasetVersion.count();
  const reqs = await prisma.developmentRequest.findMany();

  const totalIssues = reqs.length;
  const issuesSolved = reqs.filter(r => r.status === 'CLOSED').length;
  const issuesBeingSolved = reqs.filter(r => r.status === 'UNDER_ANALYSIS' || r.status === 'REVIEWED').length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.dashboard}</h2>
      
      {/* Overview Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border border-gray-100">
          <div className="text-3xl font-bold text-gray-700">{totalIssues}</div>
          <div className="text-sm text-gray-500 mt-2">{dict.totalIssues || "Total Issues"}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100">
          <div className="text-3xl font-bold text-emerald-600">{issuesSolved}</div>
          <div className="text-sm text-gray-500 mt-2">{dict.issuesSolved || "Issues Solved"}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">{issuesBeingSolved}</div>
          <div className="text-sm text-gray-500 mt-2">{dict.issuesBeingSolved || "Issues Currently Being Solved"}</div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-800">{dict.dashboard} Overview</h3>
      <AdminIssuesTabs reqs={reqs} dict={dict} />
    </div>
  );
}
