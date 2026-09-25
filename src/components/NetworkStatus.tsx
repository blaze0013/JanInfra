'use client';

import { useEffect, useState } from 'react';
import { getOfflineComplaints, saveOfflineComplaint, removeOfflineComplaint } from '@/lib/offlineQueue';
import { submitRequest } from '@/app/citizen/submit/action';
import { AlertCircle, Wifi, WifiOff, UploadCloud, CheckCircle } from 'lucide-react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load
    checkPending();

    // Setup SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Interval to re-check queue and sync if online
    const interval = setInterval(() => {
      checkPending();
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0 && syncStatus === 'idle') {
      syncPendingReports();
    }
  }, [isOnline, pendingCount]);

  const checkPending = async () => {
    try {
      const items = await getOfflineComplaints();
      setReports(items);
      setPendingCount(items.length);
    } catch (e) {
      console.error(e);
    }
  };

  const syncPendingReports = async () => {
    if (syncStatus === 'syncing') return;
    setSyncStatus('syncing');

    try {
      const items = await getOfflineComplaints();
      if (items.length === 0) {
        setSyncStatus('idle');
        return;
      }

      for (const item of items) {
        try {
          const fd = new FormData();
          // reconstruct FormData
          Object.keys(item.data).forEach(key => {
            fd.append(key, item.data[key]);
          });
          
          await submitRequest(fd);
          await removeOfflineComplaint(item.id);
        } catch (e: any) {
          if (e?.message?.includes('NEXT_REDIRECT') || e?.digest?.includes('NEXT_REDIRECT')) {
            await removeOfflineComplaint(item.id);
          } else {
            console.error('Failed to sync item', item.id, e);
            throw e;
          }
        }
      }

      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
      checkPending();
    } catch (e) {
      console.error(e);
      setSyncStatus('failed');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer border hover:bg-slate-50 z-50 transition-all"
      >
        {isOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-orange-500" />}
        <span className="text-sm font-medium text-slate-700">
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {pendingCount > 0 && (
          <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <UploadCloud className="w-3 h-3" />
            {pendingCount} Pending
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg w-80 border overflow-hidden z-50 flex flex-col max-h-[80vh]">
      <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-orange-500" />}
          <h3 className="font-bold text-slate-800">Connection Status</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold px-2">&times;</button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-1">Status: <strong className={isOnline ? 'text-green-600' : 'text-orange-600'}>{isOnline ? 'Online' : 'Offline - Reports will be saved locally'}</strong></p>
          <p className="text-sm text-slate-600">Pending Sync: <strong>{pendingCount} reports</strong></p>
        </div>

        {syncStatus === 'syncing' && (
          <div className="bg-blue-50 text-blue-800 text-xs p-2 rounded mb-4 flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            Syncing pending reports...
          </div>
        )}
        {syncStatus === 'synced' && (
          <div className="bg-green-50 text-green-800 text-xs p-2 rounded mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            All reports synced successfully.
          </div>
        )}
        {syncStatus === 'failed' && (
          <div className="bg-red-50 text-red-800 text-xs p-2 rounded mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Sync failed - will retry later.
          </div>
        )}

        <div className="space-y-2">
          {reports.map((r, i) => (
            <div key={r.id} className="text-xs bg-slate-50 border p-2 rounded">
              <div className="font-medium text-slate-800 mb-1">Report #{i + 1}</div>
              <div className="text-slate-500 truncate">{r.data.description || r.data.address || 'No description'}</div>
              <div className="text-orange-600 mt-1 flex items-center gap-1">
                <WifiOff className="w-3 h-3" /> Waiting for network
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-sm text-slate-400 text-center py-4">No pending reports</div>
          )}
        </div>
      </div>
      
      {reports.length > 0 && isOnline && syncStatus !== 'syncing' && (
        <div className="p-3 border-t bg-slate-50">
          <button 
            onClick={syncPendingReports}
            className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700"
          >
            Sync Now
          </button>
        </div>
      )}
    </div>
  );
}
