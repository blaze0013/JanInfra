import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full p-6 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900">JanInfra Insight</h1>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-blue-900 font-medium hover:underline">
            Login
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            A Multilingual Citizen-Development Intelligence Platform
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Submit infrastructure problems in your language. We use AI-assisted analysis to aggregate demand and help prioritize government investments effectively.
          </p>
          
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 text-left rounded shadow-sm">
            <p className="font-bold">Important Notice</p>
            <p>This is a decision-support tool. AI outputs are not official government decisions, approved projects, or guaranteed public-spending decisions.</p>
            <p className="mt-2 text-sm">Demo data is currently in use — not official government statistics.</p>
          </div>

          <Link href="/login" className="inline-block bg-blue-600 text-white text-lg px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
          </Link>
        </div>
      </main>
      
      <footer className="bg-gray-200 text-gray-600 text-sm py-6 text-center">
        <p>&copy; 2026 JanInfra Insight. <Link href="/privacy" className="underline">Privacy Notice</Link></p>
      </footer>
    </div>
  );
}
