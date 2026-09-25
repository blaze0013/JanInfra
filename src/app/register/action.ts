'use server'

import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { otpStore } from '@/lib/otp';

export async function handleRegister(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'CITIZEN';
  
  const govIdType = formData.get('govIdType') as string;
  const govIdNumber = formData.get('govIdNumber') as string;
  const otp = formData.get('otp') as string;
  
  if (!otp) return { error: 'OTP is required.' };
  
  // Verify OTP
  const storedOtp = otpStore.get(govIdNumber);
  if (!storedOtp || storedOtp !== otp) {
    // We can allow "123456" as a magic OTP just in case they don't look at the console
    if (otp !== '123456') {
      return { error: 'Invalid or expired OTP.' };
    }
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'Email already in use.' };
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // Local demo only
        role,
        govIdType,
        govIdNumber,
        isVerified: true, // we assume OTP is valid for demo
        citizenProfile: role === 'CITIZEN' ? {
          create: {
            languagePreference: 'en'
          }
        } : undefined
      }
    });

    const cookieStore = await cookies();
    cookieStore.set('session', user.id, { httpOnly: true, path: '/' });
    
  } catch (error) {
    return { error: 'Failed to create account.' };
  }

  if (role === 'CITIZEN') redirect('/citizen');
  if (role === 'ANALYST') redirect('/analyst');
  if (role === 'ADMIN') redirect('/admin');
  
  redirect('/');
}
