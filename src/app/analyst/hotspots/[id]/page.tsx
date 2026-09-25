import { prisma } from '@/lib/db';
import BackButton from '@/components/BackButton';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

export default async function HotspotDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst || {};
  const localDict = getDictionary(lang).hotspotDetail || {
    hotspot: "Hotspot: ",
    analyticalScore: "Analytical Priority Score",
    demand: "Demand",
    totalRequests: "Total Requests",
    uniqueCitizens: "Unique Citizens",
    avgSeverity: "Avg Severity",
    demandScore: "Demand Score",
    infraGap: "Infrastructure Gap",
    infraUnavail: "Infrastructure indicator unavailable.",
    infraGapScore: "Infra Gap Score",
    scoreBreakdown: "Score Breakdown",
    severity: "Severity",
    priorityScore: "Priority Score",
    notOfficial: "Not an official government ranking.",
    govtPlans: "Government Plans",
    noMatch: "No matching government project found in imported dataset.",
    projectName: "Project Name",
    status: "Status",
    budget: "Budget",
    source: "Source"
  };
  
  // parse district and category from id
  const [encodedDistrict, encodedCategory] = id.split('_');
  const district = decodeURIComponent(encodedDistrict);
  const category = decodeURIComponent(encodedCategory);

  const reqs = await prisma.developmentRequest.findMany({
    where: { district, OR: [{ category: { name: category } }, { aiCategory: category }] }
  });

  const totalRequests = reqs.length;
  const uniqueCitizens = new Set(reqs.map(r => r.citizenId)).size;
  const avgSeverity = reqs.length > 0 ? (reqs.reduce((sum, r) => sum + r.severity, 0) / reqs.length).toFixed(1) : 0;

  const indicators = await prisma.infrastructureIndicator.findMany({
    where: { geographyCode: district }
  });

  const projects = await prisma.governmentProject.findMany({
    where: { districtCode: district, category }
  });

  // Calculate priority score components (dummy for now)
  const demandScore = 82;
  const infraScore = 74;
  const sevScore = parseFloat(avgSeverity as string) * 20; // 5 -> 100
  const priorityScore = (demandScore * 0.40) + (infraScore * 0.35) + (sevScore * 0.25);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-2">
        <BackButton />
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{localDict.hotspot} {district} - {category}</h2>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-500 uppercase">{localDict.analyticalScore}</div>
          <div className="text-4xl font-black text-blue-900">{priorityScore.toFixed(1)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Demand */}
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{localDict.demand}</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">{localDict.totalRequests}</span>
              <span className="font-bold">{totalRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{localDict.uniqueCitizens}</span>
              <span className="font-bold">{uniqueCitizens}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{localDict.avgSeverity}</span>
              <span className="font-bold text-red-600">{avgSeverity} / 5</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{localDict.demandScore}</span>
                <span className="font-bold text-blue-800">{demandScore}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{localDict.infraGap}</h3>
          {indicators.length === 0 ? (
            <p className="text-sm text-gray-500">{localDict.infraUnavail}</p>
          ) : (
            <ul className="space-y-3 mb-4">
              {indicators.map(ind => (
                <li key={ind.id} className="text-sm">
                  <div className="text-gray-500">{ind.indicatorName}</div>
                  <div className="font-medium text-gray-900">{ind.value} {ind.unit} <span className="text-gray-400 font-normal">({ind.year})</span></div>
                </li>
              ))}
            </ul>
          )}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{localDict.infraGapScore}</span>
              <span className="font-bold text-blue-800">{infraScore}/100</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-slate-50 p-6 rounded shadow border">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{localDict.scoreBreakdown}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{localDict.demand} (40%)</span>
              <span className="font-bold">{demandScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{localDict.infraGap} (35%)</span>
              <span className="font-bold">{infraScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{localDict.severity} (25%)</span>
              <span className="font-bold">{sevScore}</span>
            </div>
            <div className="pt-4 mt-2 border-t flex justify-between font-bold text-base">
              <span>{localDict.priorityScore}</span>
              <span className="text-blue-900">{priorityScore.toFixed(1)}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              {localDict.notOfficial}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow border mt-6">
        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{localDict.govtPlans}</h3>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-500">{localDict.noMatch}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700 border-b">
                  <th className="p-2 font-semibold">{localDict.projectName}</th>
                  <th className="p-2 font-semibold">{localDict.status}</th>
                  <th className="p-2 font-semibold">{localDict.budget}</th>
                  <th className="p-2 font-semibold">{localDict.source}</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2 font-medium">{p.projectName}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2">₹ {p.budgetAmount?.toLocaleString()}</td>
                    <td className="p-2 text-gray-500">{p.sourceReference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
