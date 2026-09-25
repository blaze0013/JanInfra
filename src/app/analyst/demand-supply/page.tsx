import { getDemandVsSupply } from '@/lib/services/analytics';
import { getDictionary } from '@/lib/i18n';
import { getUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function DemandSupplyAnalysis({ searchParams }: { searchParams: { state?: string, district?: string } }) {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst || {};
  const pageDict = getDictionary(lang).demandSupply || {
    title: "Demand vs Supply Analysis",
    filterByDistrict: "Filter by District",
    allDistricts: "All Districts",
    analyze: "Analyze",
    citizenDemand: "Citizen Demand",
    totalCitizenRequests: "Total Citizen Requests",
    uniqueCitizens: "Unique Citizens",
    avgSeverity: "Average Severity",
    infraSupply: "Infrastructure Supply (Projects)",
    matchingProjects: "Matching Govt Projects",
    active: "Active",
    planned: "Planned",
    completed: "Completed",
    totalInvestment: "Total Investment",
    dataUnavailable: "Investment data unavailable.",
    planningGap: "Planning Gap Analysis",
    gapWarning: "High citizen demand exists, but no relevant government project was found in the available dataset. This represents a potential planning gap."
  };
  
  // Need to await searchParams in Next.js 15
  const params = await searchParams;

  const data = await getDemandVsSupply({ state: params.state, district: params.district });

  const allDistricts = await prisma.developmentRequest.groupBy({ by: ['district'] });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{pageDict.title}</h2>

      <div className="bg-white p-4 rounded shadow mb-6 border border-gray-200">
        <form className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">{pageDict.filterByDistrict}</label>
            <select name="district" className="border rounded p-2 text-sm w-48" defaultValue={params.district || ''}>
              <option value="">{pageDict.allDistricts}</option>
              {allDistricts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800">{pageDict.analyze}</button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-600">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{pageDict.citizenDemand}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">{pageDict.totalCitizenRequests}</span>
              <span className="text-2xl font-bold text-blue-700">{data.demand.totalRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">{pageDict.uniqueCitizens}</span>
              <span className="text-xl font-bold text-slate-700">{data.demand.uniqueCitizens}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">{pageDict.avgSeverity}</span>
              <span className={`px-2 py-1 rounded text-sm font-bold ${data.demand.avgSeverity >= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {data.demand.avgSeverity.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow border-t-4 border-emerald-600">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{pageDict.infraSupply}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">{pageDict.matchingProjects}</span>
              <span className="text-2xl font-bold text-emerald-700">{data.supply.totalProjects}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-emerald-50 p-2 text-center rounded border border-emerald-100">
                <div className="text-xs text-gray-500 uppercase font-bold">{pageDict.active}</div>
                <div className="text-lg font-bold text-emerald-800">{data.supply.activeProjects}</div>
              </div>
              <div className="bg-blue-50 p-2 text-center rounded border border-blue-100">
                <div className="text-xs text-gray-500 uppercase font-bold">{pageDict.planned}</div>
                <div className="text-lg font-bold text-blue-800">{data.supply.plannedProjects}</div>
              </div>
              <div className="bg-slate-50 p-2 text-center rounded border border-slate-200">
                <div className="text-xs text-gray-500 uppercase font-bold">{pageDict.completed}</div>
                <div className="text-lg font-bold text-slate-800">{data.supply.completedProjects}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600 font-medium">{pageDict.totalInvestment}</span>
              <span className="text-lg font-bold text-gray-800">
                {data.supply.totalBudget > 0 ? `₹${(data.supply.totalBudget / 10000000).toFixed(2)} Cr` : <span className="text-sm font-normal text-gray-400 italic">{pageDict.dataUnavailable}</span>}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded shadow border-l-4 ${data.demand.totalRequests > 0 && data.supply.totalProjects === 0 ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-400'}`}>
        <h3 className="text-lg font-bold mb-2">{pageDict.planningGap}</h3>
        <p className="text-gray-700 font-medium">{data.gapAnalysis}</p>
        
        {data.demand.totalRequests > 0 && data.supply.totalProjects === 0 && (
          <p className="mt-2 text-sm text-red-700">
            {pageDict.gapWarning}
          </p>
        )}
      </div>
      
    </div>
  );
}
