'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ 
  className = '', 
  showText = true,
  colorClass = 'text-blue-600 hover:text-blue-800'
}: { 
  className?: string;
  showText?: boolean;
  colorClass?: string;
}) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className={`flex items-center hover:underline font-medium ${colorClass} ${className}`}
    >
      <ArrowLeft size={16} className={showText ? "mr-1" : ""} />
      {showText && "Back"}
    </button>
  );
}
