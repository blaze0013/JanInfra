'use client';

import { useState, useEffect } from 'react';
import { handleLogin } from './action';

import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [saveConsent, setSaveConsent] = useState(false);
  
  useEffect(() => {
    // Load saved details on mount
    const saved = localStorage.getItem('janinfra_login_details');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.email) setEmail(data.email);
        setSaveConsent(true);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Autosave if consent given
    if (saveConsent) {
      localStorage.setItem('janinfra_login_details', JSON.stringify({ email }));
    } else {
      localStorage.removeItem('janinfra_login_details');
    }
  }, [email, saveConsent]);

  async function onSubmit(formData: FormData) {
    const res = await handleLogin(formData);
    if (res?.error) setError(res.error);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4">
        <BackButton />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form action={onSubmit} className="space-y-4">
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

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="saveConsentLogin"
              checked={saveConsent}
              onChange={e => setSaveConsent(e.target.checked)}
              className="rounded text-blue-600"
            />
            <label htmlFor="saveConsentLogin" className="text-sm text-gray-600">
              Remember my email for next time
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
