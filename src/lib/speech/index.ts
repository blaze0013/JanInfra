export interface SpeechService {
  transcribe(audioBlob: Blob, language: string): Promise<string>;
}

class DemoSpeechService implements SpeechService {
  async transcribe(audioBlob: Blob, language: string): Promise<string> {
    // Return a mock transcription for the demo
    return "This is a demo transcription of the voice request indicating that the local road is damaged and water is leaking.";
  }
}

class GoogleSpeechService implements SpeechService {
  async transcribe(audioBlob: Blob, language: string): Promise<string> {
    throw new Error("Google Speech credentials not configured.");
  }
}

export function getSpeechService(): SpeechService {
  if (process.env.GOOGLE_CLOUD_PROJECT) {
    return new GoogleSpeechService();
  }
  return new DemoSpeechService();
}
