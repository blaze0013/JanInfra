import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { setLanguage } from './action';
import { getDictionary } from '@/lib/i18n';

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const currentLang = user.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(currentLang).settings || {
    title: "Settings",
    langPref: "Language Preferences",
    save: "Save",
    langHelp: "Changes the UI language globally across all dashboards.",
    notifications: "Notifications",
    emailAlerts: "Email Alerts",
    smsAlerts: "SMS Alerts"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{dict.title}</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-2">{dict.langPref}</h2>
              <form action={setLanguage} className="flex gap-4 items-end">
                <div className="flex-1">
                  <select 
                    name="language" 
                    defaultValue={currentLang}
                    className="w-full border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English (English)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="bn">Bengali (বাংলা)</option>
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                  </select>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
                  {dict.save}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">{dict.langHelp}</p>
            </div>
            
            <hr />
            
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-2">{dict.notifications}</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span className="text-sm text-gray-600">{dict.emailAlerts}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span className="text-sm text-gray-600">{dict.smsAlerts}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
