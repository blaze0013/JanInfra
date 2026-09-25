import { prisma } from '@/lib/db';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

export default async function AnalystRequests() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst || {};
  const localDict = getDictionary(lang).analystRequests || {
    title: "All Requests",
    reference: "Reference",
    location: "Location",
    category: "Category",
    severity: "Severity",
    status: "Status",
    action: "Action",
    review: "Review"
  };

  const requests = await prisma.developmentRequest.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{localDict.title}</h2>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-sm border-b">
              <th className="p-4 font-semibold">{localDict.reference}</th>
              <th className="p-4 font-semibold">{localDict.location}</th>
              <th className="p-4 font-semibold">{localDict.category}</th>
              <th className="p-4 font-semibold">{localDict.severity}</th>
              <th className="p-4 font-semibold">{localDict.status}</th>
              <th className="p-4 font-semibold">{localDict.action}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-b hover:bg-slate-50 text-sm">
                <td className="p-4 font-medium text-slate-900">{req.reference}</td>
                <td className="p-4 text-slate-600">{req.district}, {req.state}</td>
                <td className="p-4 text-slate-600">{req.aiCategory || req.category?.name}</td>
                <td className="p-4 text-slate-600">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${req.severity >= 4 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {req.severity}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-200 text-slate-800 rounded text-xs font-medium">
                    {req.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/analyst/requests/${req.id}`} className="text-blue-600 hover:underline">{localDict.review}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
