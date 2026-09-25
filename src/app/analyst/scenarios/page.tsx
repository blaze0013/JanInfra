import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

export default async function ScenarioAnalysis() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).scenarios || {
    title: "Scenario & What-If Analysis",
    warning: "Scenario analysis — does not modify the official/default score.",
    warningDesc: "Use this tool to adjust analytical weighting parameters and simulate how priority scores would change under different policy focuses (e.g., Demand vs. Infrastructure Gap).",
    createScenario: "Create Scenario",
    scenarioName: "Scenario Name",
    demandWeight: "Demand Weight (%)",
    infraWeight: "Infra Gap Weight (%)",
    severityWeight: "Severity Weight (%)",
    simulate: "Simulate Score",
    savedScenarios: "Saved Scenarios",
    noScenarios: "No scenarios saved yet.",
    demand: "Demand",
    infra: "Infra",
    severity: "Severity",
    applyFilter: "Apply Filter"
  };

  const scenarios = await prisma.scenario.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.title}</h2>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded text-sm text-yellow-800">
        <strong className="block mb-1">{dict.warning}</strong>
        {dict.warningDesc}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">{dict.createScenario}</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">{dict.scenarioName}</label>
              <input type="text" className="w-full border p-2 rounded text-sm" placeholder="e.g., Demand-Focused" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">{dict.demandWeight}</label>
              <input type="number" defaultValue={40} className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">{dict.infraWeight}</label>
              <input type="number" defaultValue={35} className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">{dict.severityWeight}</label>
              <input type="number" defaultValue={25} className="w-full border p-2 rounded text-sm" />
            </div>
            <button type="button" className="w-full bg-blue-600 text-white font-bold py-2 rounded text-sm hover:bg-blue-700">{dict.simulate}</button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">{dict.savedScenarios}</h3>
          {scenarios.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-gray-50 rounded border border-dashed">
              {dict.noScenarios}
            </div>
          ) : (
            <div className="space-y-4">
              {scenarios.map(s => (
                <div key={s.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">{s.name}</h4>
                    <p className="text-xs text-gray-500">{dict.demand}: {s.demandWeight}% | {dict.infra}: {s.infrastructureWeight}% | {dict.severity}: {s.severityWeight}%</p>
                  </div>
                  <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200">{dict.applyFilter}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
