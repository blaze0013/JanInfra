'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';

export default function UserMenu({ email, dict = {} }: { email: string, dict?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded transition"
      >
        <UserCircle size={24} />
        <span className="text-sm font-medium hidden md:inline">{email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-700 border border-gray-200">
          <div className="px-4 py-2 border-b text-sm font-medium text-gray-900 md:hidden">
            {email}
          </div>
          <Link 
            href="/profile" 
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} className="mr-2" />
            {dict.profile || "Profile"}
          </Link>
          <Link 
            href="/settings" 
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} className="mr-2" />
            {dict.settings || "Settings"}
          </Link>
          <hr className="my-1 border-gray-200" />
          <form action="/api/logout" method="POST">
            <button 
              type="submit" 
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
            >
              <LogOut size={16} className="mr-2" />
              {dict.signOut || "Sign out"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
