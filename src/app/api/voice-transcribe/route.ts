import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as Blob;
    const language = formData.get('language') as string || 'en';

    if (!audioBlob) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback for demo if no API key is provided
      return NextResponse.json({ text: "This is a fallback transcription since Gemini API key is missing. Original audio was received." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const buffer = await audioBlob.arrayBuffer();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: audioBlob.type || 'audio/webm',
            data: Buffer.from(buffer).toString('base64')
          }
        },
        `Please transcribe this audio into text. It is likely spoken in the language code: ${language}. Just return the transcription text in the same language. Do not add any extra commentary.`
      ]
    });

    if (!response.text) {
      throw new Error("Gemini returned empty text");
    }

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
