import { GoogleGenAI, Type, Schema as GeminiSchema } from '@google/genai';
import { z } from 'zod';

export interface AIAnalysisResult {
  category: string;
  subcategory?: string;
  summary: string;
  severity: number;
  requires_human_review: boolean;
}

const AIAnalysisResultSchema = z.object({
  category: z.string(),
  subcategory: z.string().optional(),
  summary: z.string(),
  severity: z.number().int().min(1).max(5),
  requires_human_review: z.boolean(),
});

export interface AIService {
  analyzeRequest(text: string, language: string): Promise<AIAnalysisResult>;
}

class DemoAIService implements AIService {
  async analyzeRequest(text: string, language: string): Promise<AIAnalysisResult> {
    const lowerText = text.toLowerCase();
    
    // Simple deterministic logic for demo
    if (lowerText.includes('water') || lowerText.includes('pani')) {
      return {
        category: 'Drinking Water',
        subcategory: 'Pipeline Supply',
        summary: `Citizen reported issues with drinking water supply. (${text})`,
        severity: 4,
        requires_human_review: false
      };
    }
    
    if (lowerText.includes('road') || lowerText.includes('sadak')) {
      return {
        category: 'Roads & Connectivity',
        subcategory: 'Potholes',
        summary: `Citizen reported road damage. (${text})`,
        severity: 3,
        requires_human_review: false
      };
    }
    
    return {
      category: 'Other',
      summary: `Automated summary: ${text.substring(0, 50)}...`,
      severity: 2,
      requires_human_review: true
    };
  }
}

class GoogleGeminiService implements AIService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyzeRequest(text: string, language: string): Promise<AIAnalysisResult> {
    if (!text || text.trim() === '') {
      return {
        category: 'Other',
        summary: 'Empty or invalid input provided.',
        severity: 1,
        requires_human_review: true
      };
    }

    try {
      const responseSchema: GeminiSchema = {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "The primary infrastructure category this request falls under (e.g., 'Roads & Connectivity', 'Drinking Water', 'Health', 'Education', 'Other')"
          },
          subcategory: {
            type: Type.STRING,
            description: "A more specific subcategory of the problem"
          },
          summary: {
            type: Type.STRING,
            description: `A concise English summary of the issue (translated if the input is in ${language})`
          },
          severity: {
            type: Type.INTEGER,
            description: "A severity score from 1 (minor inconvenience) to 5 (critical public emergency)"
          },
          requires_human_review: {
            type: Type.BOOLEAN,
            description: "True if the request is ambiguous, nonsensical, or needs human verification. False if it's a clear, straightforward infrastructure request."
          }
        },
        required: ["category", "summary", "severity", "requires_human_review"]
      };

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI assistant for a civic infrastructure grievance portal.
Categorize and summarize the following citizen request.
The request is likely written in: ${language}.
Always output your summary in English.
Assign a severity score from 1-5 where 1 is minor inconvenience and 5 is a critical public emergency.
If the text does not make sense or is not a civic grievance, set requires_human_review to true.

Citizen Request: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      });

      if (!response.text) {
        throw new Error("Gemini returned empty text");
      }

      const parsedJson = JSON.parse(response.text);
      
      // Validate with Zod
      const result = AIAnalysisResultSchema.parse(parsedJson);
      
      return result;

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Clean fallback consistent with application schema
      return {
        category: 'Other',
        summary: `Error processing request via AI. Original text length: ${text.length} chars.`,
        severity: 3,
        requires_human_review: true
      };
    }
  }
}

export function getAIService(): AIService {
  // Use Demo if explicitly requested or if key is missing
  if (process.env.AI_PROVIDER === 'demo' || !process.env.GEMINI_API_KEY) {
    return new DemoAIService();
  }
  return new GoogleGeminiService();
}
