import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { getDictionary } from '@/lib/i18n';

export default async function CitizenRequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) redirect('/login');

  const lang = user.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).requestDetail;

  const { id } = await params;
  const req = await prisma.developmentRequest.findUnique({
    where: { id, citizenId: user.id },
    include: { category: true }
  });

  if (!req) return <div>{dict?.notFound || "Request not found or you don't have permission."}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton />
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{dict?.requestTitle || "Request"} {req.reference}</h2>
            <p className="text-gray-500">{dict?.submittedOn || "Submitted on"} {new Date(req.createdAt).toLocaleDateString()}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-medium">
            {req.status}
          </span>
        </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-gray-700 mb-2">{dict?.originalSubmission || "Original Submission"}</h3>
          <div className="bg-gray-50 p-4 rounded border text-gray-800">
            {req.originalText || dict?.voiceUnavailable || "Voice request (transcript not available)"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-700 mb-1">{dict?.category || "Category"}</h3>
            <p>{req.category?.name || req.aiCategory || dict?.uncategorized || 'Uncategorized'}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-1">{dict?.severity || "Severity"}</h3>
            <p>{req.severity} / 5</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-1">{dict?.location || "Location"}</h3>
            <p>{req.district}, {req.state}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-1">{dict?.language || "Language"}</h3>
            <p className="uppercase">{req.language}</p>
          </div>
        </div>

        {req.aiSummary && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded">
            <h3 className="font-bold text-blue-900 mb-2">{dict?.aiSummary || "AI Summary"}</h3>
            <p className="text-blue-800 text-sm">{req.aiSummary}</p>
          </div>
        )}

        <div className="bg-white border p-4 rounded shadow-sm mt-6">
          <h3 className="font-bold text-gray-700 mb-2">{dict?.actionStatus || "Action Status"}</h3>
          <p className="text-gray-600 mb-4">
            {req.status === 'CLOSED' 
              ? (dict?.resolvedMsg || 'This request has been resolved. You can download the full action report below.')
              : (dict?.processingMsg || 'This request is currently being processed. You can download the interim action report below.')}
          </p>
          <a href={`/api/report/${req.id}`} target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 inline-block">
            {dict?.downloadPdf || "Download PDF Report"}
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}
