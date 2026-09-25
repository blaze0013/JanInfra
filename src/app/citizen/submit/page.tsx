import SubmitForm from '@/components/citizen/SubmitForm';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';

export default async function SubmitRequestPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  
  const lang = user.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).submit;

  return <SubmitForm dict={dict} />;
}
