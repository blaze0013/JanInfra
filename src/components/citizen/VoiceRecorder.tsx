'use client';

import { useState, useRef } from 'react';
import { Mic, Square, RotateCcw, Play, Loader2 } from 'lucide-react';

export default function VoiceRecorder({ onTranscript, language = 'en' }: { onTranscript: (text: string) => void, language?: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsProcessing(true);
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('language', language);

          const response = await fetch('/api/voice-transcribe', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const data = await response.json();
          onTranscript(data.text || "");
        } catch (error) {
          console.error("Transcription error:", error);
          alert("Failed to transcribe audio.");
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setHasRecorded(false);
      setTimer(0);
      
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Microphone permission denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setHasRecorded(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const retry = () => {
    setHasRecorded(false);
    setTimer(0);
    onTranscript("");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-gray-50 border p-4 rounded-lg flex flex-col items-center justify-center space-y-4">
      {!isRecording && !hasRecorded && (
        <button type="button" onClick={startRecording} className="flex flex-col items-center text-blue-600 hover:text-blue-800">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <Mic size={32} />
          </div>
          <span className="font-medium">Tap to Record Voice</span>
        </button>
      )}

      {isRecording && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2 animate-pulse">
            <Mic size={32} />
          </div>
          <span className="text-red-600 font-bold mb-4">{formatTime(timer)} / 2:00</span>
          <button type="button" onClick={stopRecording} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
            <Square size={16} /> Stop Recording
          </button>
        </div>
      )}

      {hasRecorded && isProcessing && (
        <div className="flex flex-col items-center text-blue-600">
          <Loader2 size={32} className="animate-spin mb-2" />
          <span>Processing audio with AI...</span>
        </div>
      )}

      {hasRecorded && !isProcessing && (
        <div className="w-full">
          <div className="flex items-center justify-between bg-white p-3 rounded border mb-2">
            <div className="flex items-center gap-3">
              <button type="button" className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                <Play size={16} />
              </button>
              <span className="text-sm font-medium">Recording.webm ({formatTime(timer)})</span>
            </div>
            <button type="button" onClick={retry} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm">
              <RotateCcw size={16} /> Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
