'use client';

import { useState } from 'react';

type Request = {
  id: string;
  reference: string;
  status: string;
  categoryId: string | null;
  state: string;
  district: string;
  originalText: string | null;
  category?: { name: string } | null;
  aiCategory?: string | null;
};

export default function AdminIssuesTabs({ reqs, dict }: { reqs: Request[], dict: any }) {
  const [tab, setTab] = useState<'total' | 'solved' | 'solving'>('total');

  const total = reqs;
  const solved = reqs.filter(r => r.status === 'CLOSED');
  const solving = reqs.filter(r => r.status === 'UNDER_ANALYSIS' || r.status === 'REVIEWED');

  const getList = () => {
    if (tab === 'solved') return solved;
    if (tab === 'solving') return solving;
    return total;
  };

  const displayedIssues = getList();

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b pb-4">
        <button
          onClick={() => setTab('total')}
          className={`flex-1 py-3 px-4 rounded shadow font-medium ${
            tab === 'total' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {dict.totalIssues || "Total Issues"} ({total.length})
        </button>
        <button
          onClick={() => setTab('solved')}
          className={`flex-1 py-3 px-4 rounded shadow font-medium ${
            tab === 'solved' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {dict.issuesSolved || "Issues Solved"} ({solved.length})
        </button>
        <button
          onClick={() => setTab('solving')}
          className={`flex-1 py-3 px-4 rounded shadow font-medium ${
            tab === 'solving' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {dict.issuesBeingSolved || "Issues Currently Being Solved"} ({solving.length})
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-sm border-b">
              <th className="p-4 font-semibold">{dict.reference || "Reference"}</th>
              <th className="p-4 font-semibold">{dict.category || "Category"}</th>
              <th className="p-4 font-semibold">{dict.status || "Status"}</th>
              <th className="p-4 font-semibold">{dict.action || "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {displayedIssues.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  {dict.noDescription || "No issues found."}
                </td>
              </tr>
            ) : displayedIssues.map(req => (
              <tr key={req.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">
                  {req.reference}
                  <div className="text-xs text-gray-500 mt-1">{dict.locationLabel || "Location: "} {req.district}, {req.state}</div>
                </td>
                <td className="p-4 text-gray-600">
                  {req.category?.name || req.aiCategory || 'Uncategorized'}
                  {req.originalText && (
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs" title={req.originalText}>
                      {req.originalText}
                    </div>
                  )}
                  {!req.originalText && <div className="text-xs text-gray-400 mt-1 italic">{dict.noDescription || "No description provided."}</div>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    req.status === 'CLOSED' ? 'bg-green-100 text-green-800' :
                    req.status === 'UNDER_ANALYSIS' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4">
                  <a href={`/api/report/${req.id}`} target="_blank" className="text-blue-600 hover:underline text-sm font-medium">
                    {dict.downloadPdf || "Download PDF Report"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
