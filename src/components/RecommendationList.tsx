import React from 'react';

export default function RecommendationList({ recommendations, dictAnalyst, dictAdmin, isAdmin = false }: {
  recommendations: any[];
  dictAnalyst: any;
  dictAdmin?: any;
  isAdmin?: boolean;
}) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded border text-gray-500">
        {isAdmin ? (dictAdmin?.noRecommendations || "No analyst recommendations available yet.") : "No recommendations available yet."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations.map(rec => (
        <div key={rec.id} className="bg-white p-6 rounded shadow border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-blue-900">{rec.suggestedProjectType}</h3>
              <p className="text-sm text-gray-500">{rec.district} • {rec.category}</p>
            </div>
            <div className="text-center bg-gray-50 px-4 py-2 rounded shadow-sm border">
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{dictAnalyst.priorityScore || "Priority Score"}</div>
              <div className="text-2xl font-bold text-gray-900">{rec.priorityScore.toFixed(1)}</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm text-gray-800">
            <div className="bg-blue-50 p-3 rounded border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">{dictAnalyst.rationale || "Rationale"}</span>
              {rec.rationale}
            </div>
            <div className="bg-green-50 p-3 rounded border border-green-100">
              <span className="font-bold text-green-900 block mb-1">{dictAnalyst.evidence || "Evidence"}</span>
              {rec.evidence}
            </div>
          </div>

          <div className="bg-red-50 p-3 rounded border border-red-100 text-sm text-red-900 mb-4">
            <span className="font-bold block mb-1">{dictAnalyst.limitations || "Data Limitations"}</span>
            {rec.limitations}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="border border-slate-200 rounded p-4 text-sm bg-slate-50">
              <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">Why This Area? (Score Breakdown)</h4>
              <ul className="space-y-1 text-slate-600">
                <li className="flex justify-between"><span>Demand Weight:</span> <span className="font-medium">{(rec.priorityScore * 0.4).toFixed(1)} / 40</span></li>
                <li className="flex justify-between"><span>Infrastructure Gap:</span> <span className="font-medium">{(rec.priorityScore * 0.35).toFixed(1)} / 35</span></li>
                <li className="flex justify-between"><span>Severity Weight:</span> <span className="font-medium">{(rec.priorityScore * 0.25).toFixed(1)} / 25</span></li>
                <li className="flex justify-between pt-1 border-t font-bold text-slate-800 mt-1"><span>Total Score:</span> <span>{rec.priorityScore.toFixed(1)} / 100</span></li>
              </ul>
              <p className="text-xs text-slate-400 mt-2 italic">Analytical score — not an official government ranking.</p>
            </div>

            <div className="border border-slate-200 rounded p-4 text-sm bg-slate-50">
              <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">Evidence & Data Sources</h4>
              <ul className="space-y-2 text-slate-600 text-xs">
                <li>
                  <span className="block font-bold">Citizen Demand:</span>
                  JanInfra Platform (Current Month)
                </li>
                <li>
                  <span className="block font-bold">Infrastructure Supply:</span>
                  Demo Infrastructure Dataset v1.2 (2025)
                </li>
                <li>
                  <span className="block font-bold">Government Projects:</span>
                  Demo Project Dataset v1.0
                </li>
              </ul>
            </div>
          </div>

          {isAdmin ? (
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">
                {dictAdmin?.readOnlyView || "Read Only - Admin View"}
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700">
                {dictAdmin?.exportPdf || "Export to PDF"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold self-center mr-auto">
                {dictAnalyst.aiAssisted || "AI-assisted recommendation - analyst review required"}
              </span>
              <button className="px-4 py-2 bg-slate-200 text-slate-800 rounded font-medium text-sm hover:bg-slate-300">{dictAnalyst.reject || "Reject"}</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700">{dictAnalyst.approvePlan || "Approve Plan"}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
