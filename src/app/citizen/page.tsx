import { getUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';

export default async function CitizenDashboard() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).citizen;

  const requests = await prisma.developmentRequest.findMany({
    where: { citizenId: user!.id },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: requests.length,
    submitted: requests.filter(r => r.status === 'SUBMITTED').length,
    underAnalysis: requests.filter(r => r.status === 'UNDER_ANALYSIS').length,
    reviewed: requests.filter(r => r.status === 'REVIEWED').length,
    closed: requests.filter(r => r.status === 'CLOSED').length,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.dashboard}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">{dict.total}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100 text-center">
          <div className="text-3xl font-bold text-yellow-500">{stats.submitted}</div>
          <div className="text-sm text-gray-500">{dict.submitted}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100 text-center">
          <div className="text-3xl font-bold text-purple-500">{stats.underAnalysis}</div>
          <div className="text-sm text-gray-500">{dict.underAnalysis}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100 text-center">
          <div className="text-3xl font-bold text-green-500">{stats.reviewed + stats.closed}</div>
          <div className="text-sm text-gray-500">{dict.processed}</div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-800">{dict.recentSubmissions}</h3>
      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center text-gray-500">
          {dict.noRequests || "You haven't submitted any requests yet."}
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-sm border-b">
                <th className="p-4 font-semibold">{dict.reference || "Reference"}</th>
                <th className="p-4 font-semibold">{dict.category || "Category"}</th>
                <th className="p-4 font-semibold">{dict.date || "Date"}</th>
                <th className="p-4 font-semibold">{dict.status || "Status"}</th>
                <th className="p-4 font-semibold">{dict.action || "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-900">{req.reference}</td>
                  <td className="p-4 text-sm text-gray-600">{req.category?.name || 'Unknown'}</td>
                  <td className="p-4 text-sm text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <Link href={`/citizen/requests/${req.id}`} className="text-blue-600 hover:underline">{dict.view || "View"}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
