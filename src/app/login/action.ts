'use server'

import { login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let user;
  try {
    user = await login(email, password);
  } catch (error) {
    return { error: 'Invalid credentials. Please try again.' };
  }
  
  if (user) {
    if (user.role === 'CITIZEN') redirect('/citizen');
    if (user.role === 'ANALYST') redirect('/analyst');
    if (user.role === 'ADMIN') redirect('/admin');
  }
}
