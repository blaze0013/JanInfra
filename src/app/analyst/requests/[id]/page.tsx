import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';

export default async function AnalystRequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst || {};
  const localDict = getDictionary(lang).analystRequestDetail || {
    notFound: "Request not found.",
    reviewReq: "Review Request: ",
    citizenSub: "Citizen Submission",
    originalText: "Original Text",
    noText: "No text provided (voice).",
    location: "Location",
    submitted: "Submitted",
    severity: "Citizen Severity",
    aiAnalysis: "AI Analysis",
    suggCategory: "Suggested Category",
    aiSummary: "AI Summary",
    none: "None",
    humanReview: "⚠️ This request requires human review.",
    analystAction: "Analyst Action",
    overrideCat: "Override Category",
    status: "Status",
    statusOptions: {
      submitted: "Submitted",
      underAnalysis: "Under Analysis",
      reviewed: "Reviewed",
      closed: "Closed"
    },
    analystNotes: "Analyst Notes",
    saveReview: "Save Review"
  };

  const req = await prisma.developmentRequest.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!req) return <div>{localDict.notFound}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <BackButton />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{localDict.reviewReq} {req.reference}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{localDict.citizenSub}</h3>
          <p className="text-sm text-gray-500 mb-1">{localDict.originalText} ({req.language})</p>
          <div className="bg-gray-50 p-3 rounded text-sm mb-4">
            {req.originalText || localDict.noText}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">{localDict.location}</p>
              <p className="font-medium">{req.district}, {req.state}</p>
            </div>
            <div>
              <p className="text-gray-500">{localDict.submitted}</p>
              <p className="font-medium">{new Date(req.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">{localDict.severity}</p>
              <p className="font-medium">{req.severity}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow border">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{localDict.aiAnalysis}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{localDict.suggCategory}</p>
              <p className="font-medium text-blue-900">{req.aiCategory || localDict.none}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{localDict.aiSummary}</p>
              <p className="text-sm bg-blue-50 p-2 rounded text-blue-900">{req.aiSummary || localDict.none}</p>
            </div>
            {req.aiRequiresHumanReview && (
              <div className="bg-yellow-50 text-yellow-800 p-2 text-sm rounded border border-yellow-200">
                {localDict.humanReview}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow border">
        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{localDict.analystAction}</h3>
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{localDict.overrideCat}</label>
              <select className="w-full border p-2 rounded text-sm" defaultValue={req.aiCategory || ""}>
                <option value="Roads & Connectivity">Roads & Connectivity</option>
                <option value="Drinking Water">Drinking Water</option>
                <option value="Sanitation & Drainage">Sanitation & Drainage</option>
                <option value="Healthcare Infrastructure">Healthcare Infrastructure</option>
                <option value="Education Infrastructure">Education Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{localDict.status}</label>
              <select className="w-full border p-2 rounded text-sm" defaultValue={req.status}>
                <option value="SUBMITTED">{localDict.statusOptions.submitted}</option>
                <option value="UNDER_ANALYSIS">{localDict.statusOptions.underAnalysis}</option>
                <option value="REVIEWED">{localDict.statusOptions.reviewed}</option>
                <option value="CLOSED">{localDict.statusOptions.closed}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{localDict.analystNotes}</label>
            <textarea className="w-full border p-2 rounded text-sm" rows={3}></textarea>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium">{localDict.saveReview}</button>
        </form>
      </div>
    </div>
  );
}
