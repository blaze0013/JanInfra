import { prisma } from '@/lib/db';
import Link from 'next/link';
import MapWrapper from '@/components/MapWrapper';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

export default async function AnalystHotspots() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst;

  const reqs = await prisma.developmentRequest.findMany();
  const projects = await prisma.governmentProject.findMany();
  
  // Deterministic aggregation
  const hotspotMap = new Map<string, {
    district: string;
    category: string;
    count: number;
    totalSeverity: number;
  }>();

  for (const r of reqs) {
    const cat = r.aiCategory || 'Unknown';
    const key = `${r.district}-${cat}`;
    if (!hotspotMap.has(key)) {
      hotspotMap.set(key, { district: r.district, category: cat, count: 0, totalSeverity: 0 });
    }
    const entry = hotspotMap.get(key)!;
    entry.count++;
    entry.totalSeverity += r.severity;
  }

  const hotspots = Array.from(hotspotMap.values()).map(h => ({
    ...h,
    avgSeverity: (h.totalSeverity / h.count).toFixed(1)
  })).sort((a, b) => b.count - a.count);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.demandHotspots} (Intelligence Map)</h2>
      
      <div className="mb-8">
        <MapWrapper data={reqs} projects={projects} />
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-sm border-b">
              <th className="p-4 font-semibold">{dict.geography || "Geography"}</th>
              <th className="p-4 font-semibold">{dict.category || "Category"}</th>
              <th className="p-4 font-semibold">{dict.requestsCount || "Requests"}</th>
              <th className="p-4 font-semibold">{dict.avgSeverity || "Avg Severity"}</th>
              <th className="p-4 font-semibold">{dict.action || "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map(h => (
              <tr key={`${h.district}-${h.category}`} className="border-b hover:bg-slate-50 text-sm">
                <td className="p-4 font-medium text-slate-900">{h.district}</td>
                <td className="p-4 text-slate-600">{h.category}</td>
                <td className="p-4 text-slate-600 font-bold">{h.count}</td>
                <td className="p-4 text-slate-600">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${parseFloat(h.avgSeverity) >= 4 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {h.avgSeverity}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/analyst/hotspots/${encodeURIComponent(h.district)}_${encodeURIComponent(h.category)}`} className="text-blue-600 hover:underline">
                    {dict.viewDetails || "View Details"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
