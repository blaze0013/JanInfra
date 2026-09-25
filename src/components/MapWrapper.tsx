'use client';

import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('./LiveMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded flex items-center justify-center font-medium text-slate-500">Loading Intelligence Map...</div>
});

export default function MapWrapper({ data, projects = [] }: { data: any[], projects?: any[] }) {
  return <LiveMap data={data} projects={projects} />;
}
