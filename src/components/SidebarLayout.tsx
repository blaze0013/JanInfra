import React from 'react';
import UserMenu from '@/components/UserMenu';

interface SidebarLayoutProps {
  children: React.ReactNode;
  email: string;
  title: string;
  sidebarColorClass: string;
  borderColorClass: string;
  navLinks: React.ReactNode;
  commonDict?: any;
}

export default function SidebarLayout({
  children,
  email,
  title,
  sidebarColorClass,
  borderColorClass,
  navLinks,
  commonDict = {}
}: SidebarLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className={`w-full md:w-64 shrink-0 ${sidebarColorClass} text-white min-h-screen flex flex-col`}>
        <div className={`p-4 font-bold text-xl border-b ${borderColorClass} flex items-center gap-3`}>
          <span>{title}</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm">
          {navLinks}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b p-4 flex justify-end shadow-sm">
          <div className="text-gray-800">
            <UserMenu email={email} dict={commonDict} />
          </div>
        </header>
        <div className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
