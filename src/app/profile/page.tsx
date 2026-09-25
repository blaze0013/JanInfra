import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { getDictionary } from '@/lib/i18n';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const lang = user.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).profile || {
    title: "User Profile",
    username: "Username",
    email: "Email Address",
    role: "Role",
    idVerification: "ID Verification",
    verified: "Verified ✓",
    na: "N/A"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{dict.title}</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">{dict.username}</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">{user.username || dict.na}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">{dict.email}</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">{dict.role}</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">{user.role}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">{dict.idVerification}</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                <span className="capitalize">{user.govIdType || dict.na}</span>: {user.govIdNumber || dict.na}
                {user.isVerified && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">{dict.verified}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
