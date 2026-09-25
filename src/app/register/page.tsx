'use client';

import { useState, useEffect } from 'react';
import { handleRegister } from './action';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState('CITIZEN');
  const [govIdType, setGovIdType] = useState('aadhaar');
  const [govIdNumber, setGovIdNumber] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saveConsent, setSaveConsent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  useEffect(() => {
    // Load saved details on mount
    const saved = localStorage.getItem('janinfra_register_details');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.username) setUsername(data.username);
        if (data.email) setEmail(data.email);
        if (data.govIdNumber) setGovIdNumber(data.govIdNumber);
        if (data.role) setRole(data.role);
        setSaveConsent(true);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Autosave if consent given
    if (saveConsent) {
      localStorage.setItem('janinfra_register_details', JSON.stringify({
        username, email, govIdNumber, role
      }));
    } else {
      localStorage.removeItem('janinfra_register_details');
    }
  }, [username, email, govIdNumber, role, saveConsent]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  async function onSubmit(formData: FormData) {
    const res = await handleRegister(formData);
    if (res?.error) setError(res.error);
  }

  async function handleSendOtp() {
    if (!govIdNumber) {
      setError('Please enter your ID Number first.');
      return;
    }
    setError(null);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: govIdNumber, type: govIdType })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setResendTimer(60);
        alert('OTP sent to registered mobile number for ' + govIdType + ' (Check terminal or use 123456)');
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch (e) {
      setError('Error sending OTP.');
    }
  }

  // Update default ID type when role changes
  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole === 'CITIZEN') {
      setGovIdType('aadhaar');
    } else {
      setGovIdType('employeeId');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4">
        <BackButton />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              name="username" 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
              className="w-full border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
              className="w-full border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" required className="w-full border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" value={role} onChange={handleRoleChange} className="w-full border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500">
              <option value="CITIZEN">Citizen</option>
              <option value="ANALYST">Analyst</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">
              {role === 'CITIZEN' ? 'Gov ID Verification' : 'Verification ID'}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-1">
              <select 
                name="govIdType" 
                value={govIdType} 
                onChange={(e) => setGovIdType(e.target.value)}
                className="w-full border-gray-300 border p-2 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {role === 'CITIZEN' ? (
                  <>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="voter">Voter Card</option>
                    <option value="driving">Driving License</option>
                    <option value="passport">Passport</option>
                  </>
                ) : (
                  <>
                    <option value="employeeId">Employee ID</option>
                    <option value="officialGovId">Official Gov ID</option>
                  </>
                )}
              </select>
              <input 
                name="govIdNumber" 
                value={govIdNumber}
                onChange={(e) => setGovIdNumber(e.target.value)}
                type="text" 
                placeholder="ID Number" 
                required 
                className="w-full border-gray-300 border p-2 rounded text-sm focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            {role !== 'CITIZEN' && <p className="text-xs text-gray-500 mb-2 italic">Use Demo ID "123456" for quick testing.</p>}
            
            {!otpSent ? (
              <button 
                type="button" 
                onClick={handleSendOtp}
                className="w-full bg-gray-200 text-gray-800 p-2 rounded text-sm hover:bg-gray-300 font-medium"
              >
                Send SMS OTP
              </button>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Enter OTP Sent to Mobile</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    name="otp" 
                    type="text" 
                    required 
                    placeholder="6-digit OTP"
                    className="flex-1 border-gray-300 border p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    disabled={resendTimer > 0}
                    className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-300 font-medium disabled:opacity-50"
                  >
                    {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                  </button>
                </div>
                <span className="text-xs text-green-600 font-medium">OTP Sent Successfully</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="saveConsent"
              checked={saveConsent}
              onChange={e => setSaveConsent(e.target.checked)}
              className="rounded text-blue-600"
            />
            <label htmlFor="saveConsent" className="text-sm text-gray-600">
              Remember my details for next time (locally on this device)
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium mt-4" disabled={!otpSent}>
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
