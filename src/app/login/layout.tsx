import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (user) {
    if (user.role === 'CITIZEN') redirect('/citizen');
    if (user.role === 'ANALYST') redirect('/analyst');
    if (user.role === 'ADMIN') redirect('/admin');
  }

  return children;
}
