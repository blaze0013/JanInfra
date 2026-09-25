'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchLiveWeatherData } from '@/lib/data/govData';

type Request = {
  id: string;
  reference: string;
  status: string;
  category?: { name: string } | null;
  aiCategory: string | null;
  state: string;
  district: string;
  originalText: string | null;
  severity: number;
};

export default function AnalystDashboardInteractive({ 
  requests, 
  projects, 
  alerts,
  dict 
}: { 
  requests: Request[];
  projects: { id: string; stateCode: string; districtCode: string; lat?: number; lng?: number; projectName: string; category: string; status: string; budgetAmount: number | null; }[];
  alerts: { id: string; title: string; description: string; }[];
  dict: Record<string, string>;
}) {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  
  // New state for live public data
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Extract unique states and districts
  const states = Array.from(new Set(requests.map(r => r.state))).filter(Boolean);
  const districts = Array.from(new Set(requests.map(r => r.district))).filter(Boolean);

  // Filter data
  const filteredRequests = requests.filter(r => 
    (selectedState === 'All' || r.state === selectedState) &&
    (selectedDistrict === 'All' || r.district === selectedDistrict)
  );

  const filteredProjects = projects.filter(p => 
    (selectedState === 'All' || p.stateCode === selectedState) &&
    (selectedDistrict === 'All' || p.districtCode === selectedDistrict)
  );

  useEffect(() => {
    async function loadWeather() {
      if (selectedDistrict === 'All') {
        setWeatherData(null);
        return;
      }
      setIsWeatherLoading(true);
      const data = await fetchLiveWeatherData(selectedDistrict);
      setWeatherData(data);
      setIsWeatherLoading(false);
    }
    loadWeather();
  }, [selectedDistrict]);

  const activeHotspots = 3; // Mocked as per original
  const highGapAreas = 2; // Mocked as per original
  const popAffected = "~15k"; // Mocked as per original

  return (
    <div>
      {/* Dropdowns */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">{dict.state || "State"}</label>
          <select 
            value={selectedState} 
            onChange={e => setSelectedState(e.target.value)}
            className="border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">{dict.allStates || "All States"}</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">{dict.district || "District"}</label>
          <select 
            value={selectedDistrict} 
            onChange={e => setSelectedDistrict(e.target.value)}
            className="border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">{dict.allDistricts || "All Districts"}</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border border-gray-100">
          <div className="text-xs text-gray-500 mb-1 uppercase font-bold">{dict.activeHotspots || "Active Hotspots"}</div>
          <div className="text-3xl font-bold text-red-600">{activeHotspots}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100">
          <div className="text-xs text-gray-500 mb-1 uppercase font-bold">{dict.highGapAreas || "High-Gap Areas"}</div>
          <div className="text-3xl font-bold text-orange-600">{highGapAreas}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100">
          <div className="text-xs text-gray-500 mb-1 uppercase font-bold">{dict.activeGovtProjects || "Active Govt Projects"}</div>
          <div className="text-3xl font-bold text-emerald-600">{filteredProjects.length}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-100">
          <div className="text-xs text-gray-500 mb-1 uppercase font-bold">{dict.populationAffected || "Population Affected"}</div>
          <div className="text-3xl font-bold text-blue-600">{popAffected}</div>
        </div>
        {/* New Live Public Data Card */}
        <div className="bg-blue-50 p-4 rounded shadow border border-blue-200">
          <div className="text-xs text-blue-800 mb-1 uppercase font-bold flex items-center gap-1">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Weather (Open Data)
          </div>
          <div className="text-sm font-medium text-blue-900 h-10 flex flex-col justify-center">
            {selectedDistrict === 'All' ? (
              <span className="text-blue-600/70 text-xs">Select a district to view</span>
            ) : isWeatherLoading ? (
              <span className="text-blue-600/70 text-xs animate-pulse">Fetching from open API...</span>
            ) : weatherData ? (
              <div>
                <span className="text-xl font-bold">{weatherData.temperature_2m}°C</span>
                <span className="text-xs ml-2 text-blue-700">Humidity: {weatherData.relative_humidity_2m}%</span>
              </div>
            ) : (
              <span className="text-blue-600/70 text-xs">Data unavailable (Fallback active)</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white p-4 rounded shadow border border-gray-200">
           <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{dict.criticalAnalysis || "Critical Analysis (Major Reported Problems)"}</h3>
           <div className="space-y-4">
             {/* Show major reported problems first */}
             {[...filteredRequests]
               .sort((a, b) => b.severity - a.severity)
               .slice(0, 5)
               .map(r => (
                 <div key={r.id} className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded text-sm">
                   <div className="flex justify-between items-start">
                     <h4 className="font-bold text-orange-800">{r.reference} - {r.aiCategory || 'Unknown'}</h4>
                     <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded font-bold">{dict.severityLabel || "Severity: "}{r.severity}</span>
                   </div>
                   <p className="text-orange-700 mt-1">{r.originalText || dict.noDescription || "No description provided."}</p>
                   <p className="text-xs text-orange-600/80 mt-1">{dict.locationLabel || "Location: "}{r.district}, {r.state}</p>
                 </div>
             ))}

             {/* Then show any analytical alerts */}
             {alerts.map(a => (
               <div key={a.id} className="border-l-4 border-red-500 bg-red-50 p-3 rounded text-sm mt-4">
                 <h4 className="font-bold text-red-800">{a.title}</h4>
                 <p className="text-red-700">{a.description}</p>
               </div>
             ))}

             {filteredRequests.length === 0 && alerts.length === 0 && (
               <div className="text-center p-8 bg-gray-50 rounded text-gray-500">{dict.noProblems || "No major problems or alerts."}</div>
             )}
           </div>
        </div>
      </div>



      <div className="bg-white rounded shadow overflow-hidden">
        <h3 className="text-lg font-bold p-4 bg-slate-50 border-b text-gray-800">{dict.requestsList || "Requests List"}</h3>
        <div className="max-h-[500px] overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="p-4 text-gray-500">{dict.noRequests || "No requests in this region."}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-sm border-b">
                  <th className="p-4 font-semibold">{dict.reference || "Reference"}</th>
                  <th className="p-4 font-semibold">{dict.geography || "Geography"}</th>
                  <th className="p-4 font-semibold">{dict.category || "Category"}</th>
                  <th className="p-4 font-semibold">{dict.severity || "Severity"}</th>
                  <th className="p-4 font-semibold">{dict.action || "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(r => (
                  <tr key={r.id} className="border-b hover:bg-slate-50 text-sm">
                    <td className="p-4 font-medium text-slate-900">{r.reference}</td>
                    <td className="p-4">{r.district}, {r.state}</td>
                    <td className="p-4 text-slate-600">{r.aiCategory || 'Unknown'}</td>
                    <td className="p-4 text-slate-600">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${r.severity >= 4 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <a href={`/api/report/${r.id}`} target="_blank" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">
                        {dict.downloadReport || "Download Report"}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
