import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otp';

export async function POST(req: Request) {
  try {
    const { idNumber, type } = await req.json();
    
    if (!idNumber) return NextResponse.json({ error: 'ID Number is required' }, { status: 400 });

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store it mapped to the ID number (for 5 mins)
    otpStore.set(idNumber, otp);
    setTimeout(() => otpStore.delete(idNumber), 5 * 60 * 1000);

    // Local demo without Twilio
    console.log(`\n\n[MOCK SMS SERVICE - TERMINAL ONLY]`);
    console.log(`Sending OTP to mobile number linked with ${type} ${idNumber}`);
    console.log(`OTP is: ${otp}`);
    console.log(`[MOCK SMS SERVICE]\n\n`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully to linked mobile number.' });
  } catch (error: any) {
    console.error('OTP Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
