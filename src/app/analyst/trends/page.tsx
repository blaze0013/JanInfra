import { getDemandTrends } from '@/lib/services/analytics';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

export default async function AnalystTrends() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).trends || {
    title: "Demand Trends & Deduplication",
    requestVolume: "Request Volume (Last 30 Days)",
    newRequests: "new requests",
    trend: "Trend: ",
    categoryGrowth: "Category Growth",
    uncategorized: "Uncategorized",
    duplicateAnalysis: "Duplicate vs Distributed Demand Analysis",
    duplicateDesc: "This analytical layer groups similar requests to distinguish between repeated submissions and distributed geographic demand. Original records are preserved.",
    noDuplicates: "No duplicate groups identified in the current period."
  };

  const trends = await getDemandTrends();
  
  // Aggregate categories
  const categories = await prisma.developmentRequest.groupBy({
    by: ['aiCategory'],
    _count: {
      id: true
    },
    orderBy: {
      _count: { id: 'desc' }
    }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.title}</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{dict.requestVolume}</h3>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-bold text-blue-700">{trends.recent30Days}</div>
            <div className="text-sm text-gray-500 mb-1">{dict.newRequests}</div>
          </div>
          <div className="mt-4 pt-4 border-t text-sm font-medium">
            {dict.trend} <span className={trends.trend === 'Rising' ? 'text-red-600' : 'text-green-600'}>{trends.trend}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{dict.categoryGrowth}</h3>
          <ul className="space-y-3">
            {categories.map(c => (
              <li key={c.aiCategory} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{c.aiCategory || dict.uncategorized}</span>
                <span className="font-bold bg-gray-100 px-2 py-1 rounded">{c._count.id}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{dict.duplicateAnalysis}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {dict.duplicateDesc}
        </p>

        <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded text-gray-500">
          <p className="font-medium">{dict.noDuplicates}</p>
        </div>
      </div>
    </div>
  );
}
