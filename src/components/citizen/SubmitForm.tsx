'use client';

import { useState } from 'react';
import { submitRequest } from '@/app/citizen/submit/action';
import VoiceRecorder from '@/components/citizen/VoiceRecorder';
import BackButton from '@/components/BackButton';

import _INDIA_LOCATIONS from '@/lib/fallback-india-locations.json';
const INDIA_LOCATIONS = _INDIA_LOCATIONS as Record<string, string[]>;

export default function SubmitForm({ dict = {} }: { dict?: any }) {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [transcript, setTranscript] = useState('');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <BackButton />
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">{dict.title || "Submit Infrastructure Problem"}</h2>
      
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button 
          className={`font-medium px-4 py-2 rounded-t ${mode === 'text' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}
          onClick={() => setMode('text')}
          type="button"
        >
          {dict.textInput || "Text Input"}
        </button>
        <button 
          className={`font-medium px-4 py-2 rounded-t ${mode === 'voice' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}
          onClick={() => setMode('voice')}
          type="button"
        >
          {dict.voiceRecord || "Voice Record"}
        </button>
      </div>

      <form action={async (formData) => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          // Offline mode
          const data: any = {};
          formData.forEach((value, key) => data[key] = value);
          
          const { saveOfflineComplaint } = await import('@/lib/offlineQueue');
          await saveOfflineComplaint(data);
          
          alert('Report saved offline. It will automatically sync when you regain internet connection.');
          window.location.href = '/citizen';
          return;
        }
        
        // Online mode - proceed with normal server action
        await submitRequest(formData);
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{dict.language || "Language"}</label>
          <select 
            name="language" 
            className="w-full border p-2 rounded"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="mr">Marathi</option>
            <option value="te">Telugu</option>
            <option value="ta">Tamil</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{dict.state || "State"}</label>
            <select 
              name="state" 
              className="w-full border p-2 rounded" 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              required
            >
              {Object.keys(INDIA_LOCATIONS).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{dict.district || "District"}</label>
            <select name="district" className="w-full border p-2 rounded" required>
              {(INDIA_LOCATIONS[selectedState] || []).map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{dict.address || "Address / Location Details"}</label>
          <textarea name="address" rows={2} className="w-full border p-2 rounded" required placeholder="Example: Near City Center Mall, Main Road..." />
        </div>

        {mode === 'text' ? (
          <div>
            <label className="block text-sm font-medium mb-1">{dict.describeText || "Describe the Problem"}</label>
            <textarea name="description" rows={4} className="w-full border p-2 rounded" required placeholder="Example: The road near the main market has large potholes..." />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">{dict.describeVoice || "Record your problem"}</label>
            <VoiceRecorder onTranscript={setTranscript} language={selectedLanguage} />
            {transcript && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1 text-green-700">{dict.transcript || "Transcript (You can edit before submitting)"}</label>
                <textarea name="description" rows={3} className="w-full border border-green-300 p-2 rounded bg-green-50" defaultValue={transcript} required />
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Evidence (Image/Video)</label>
          <input type="file" name="media" accept="image/*,video/*" className="w-full border p-2 rounded" />
          <p className="text-xs text-gray-500 mt-1">Upload a photo or video of the issue (optional)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{dict.severity || "Severity (1=Low, 5=High)"}</label>
          <select name="severity" className="w-full border p-2 rounded" defaultValue="3">
            <option value="1">1 - Minor issue</option>
            <option value="2">2 - Moderate issue</option>
            <option value="3">3 - Serious issue</option>
            <option value="4">4 - Critical issue</option>
            <option value="5">5 - Emergency</option>
          </select>
        </div>

        <div className="pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 w-full md:w-auto" disabled={mode === 'voice' && !transcript}>
            {dict.submitBtn || "Submit Request"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
