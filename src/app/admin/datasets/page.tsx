import { prisma } from '@/lib/db';
import { importDataset } from './action';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

export default async function AdminDatasets() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).admin;

  const datasets = await prisma.datasetVersion.findMany({
    orderBy: { importedTimestamp: 'desc' }
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.manageDatasets || "Manage Datasets"}</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded shadow border">
            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{dict.importNewDataset || "Import New Dataset"}</h3>
            <form action={importDataset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{dict.datasetType || "Dataset Type"}</label>
                <select name="type" className="w-full border p-2 rounded text-sm">
                  <option value="infrastructure">{dict.infraType || "Infrastructure Indicators (CSV)"}</option>
                  <option value="projects">{dict.govtType || "Government Projects (CSV)"}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{dict.sourceName || "Source Name"}</label>
                <input name="source" type="text" placeholder="e.g. Jal Jeevan Mission" className="w-full border p-2 rounded text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{dict.version || "Version"}</label>
                <input name="version" type="text" placeholder="e.g. v2023.1" className="w-full border p-2 rounded text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{dict.fileCsv || "File (CSV)"}</label>
                <input name="file" type="file" accept=".csv" className="w-full border p-2 rounded text-sm bg-gray-50" />
              </div>
              <button type="submit" className="w-full bg-red-700 text-white p-2 rounded font-medium hover:bg-red-800">
                {dict.uploadProcess || "Upload & Process"}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded shadow border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-700">{dict.importHistory || "Import History"}</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm border-b">
                  <th className="p-3 font-semibold">{dict.source || "Source"}</th>
                  <th className="p-3 font-semibold">{dict.version || "Version"}</th>
                  <th className="p-3 font-semibold">{dict.rows || "Rows"}</th>
                  <th className="p-3 font-semibold">{dict.date || "Date"}</th>
                  <th className="p-3 font-semibold">{dict.status || "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map(ds => (
                  <tr key={ds.id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="p-3 font-medium text-gray-900">{ds.source}</td>
                    <td className="p-3 text-gray-600">{ds.version}</td>
                    <td className="p-3 text-gray-600">{ds.rowCount}</td>
                    <td className="p-3 text-gray-600">{new Date(ds.importedTimestamp).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                        {ds.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
