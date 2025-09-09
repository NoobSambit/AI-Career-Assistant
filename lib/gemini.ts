import { GoogleGenerativeAI } from '@google/generative-ai';

let _genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new InvalidApiKeyError('GEMINI_API_KEY is not configured');
  }
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

export class InvalidApiKeyError extends Error {}
export class QuotaExceededError extends Error {}
export class SafetyBlockedError extends Error {}
export class TransientGeminiError extends Error {}
export class UnknownGeminiError extends Error {}

async function withTimeoutAndRetry<T>(fn: () => Promise<T>, opts?: { timeoutMs?: number }): Promise<T> {
  const timeoutMs = opts?.timeoutMs ?? 20000;
  const attempt = async () => {
    let timer: NodeJS.Timeout | null = null;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new TransientGeminiError('Gemini request timed out')), timeoutMs);
      });
      // race timeout vs function
      return await Promise.race([fn(), timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  try {
    return await attempt();
  } catch (err: any) {
    const e = normalizeGeminiError(err);
    // Retry only on transient/5xx-like errors once with small backoff
    if (e instanceof TransientGeminiError) {
      const jitter = 500 + Math.floor(Math.random() * 1000);
      await new Promise(r => setTimeout(r, jitter));
      return attempt();
    }
    throw e;
  }
}

function normalizeGeminiError(error: any): Error {
  const msg = typeof error?.message === 'string' ? error.message : String(error);
  if (msg.includes('API_KEY_INVALID') || msg.toLowerCase().includes('api key')) return new InvalidApiKeyError(msg);
  if (msg.includes('QUOTA_EXCEEDED') || msg.toLowerCase().includes('quota')) return new QuotaExceededError(msg);
  if (msg.includes('SAFETY') || msg.toLowerCase().includes('safety')) return new SafetyBlockedError(msg);
  if (msg.includes('429') || msg.includes('503') || msg.toLowerCase().includes('unavailable') || msg.toLowerCase().includes('timeout')) return new TransientGeminiError(msg);
  return new UnknownGeminiError(msg);
}

/**
 * Generate content using Gemini 2.0 Flash model
 * @param prompt - Text prompt for the AI
 * @param imageData - Optional base64 image data
 * @param mimeType - Image MIME type if image is provided
 * @returns Promise with AI response
 */
export async function generateWithGemini(
  prompt: string,
  imageData?: string,
  mimeType?: string
): Promise<string> {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    const parts: any[] = [{ text: prompt }];
    if (imageData && mimeType) {
      parts.push({ inlineData: { data: imageData, mimeType } });
    }

    const exec = async () => {
      const result = await model.generateContent(parts);
      const response = await result.response;
      return response.text();
    };

    return await withTimeoutAndRetry(exec, { timeoutMs: 20000 });
  } catch (error) {
    throw normalizeGeminiError(error);
  }
}

/**
 * Extract text from image using Gemini Vision
 * @param base64Image - Base64 encoded image
 * @param mimeType - Image MIME type
 * @param customPrompt - Optional custom prompt for extraction
 * @returns Promise with extracted text
 */
export async function extractTextFromImage(
  base64Image: string, 
  mimeType: string, 
  customPrompt?: string
): Promise<string> {
  const defaultPrompt = `Extract all text content from this image. Please provide the text in a clean, structured format, maintaining the original layout and organization as much as possible.`;
  
  const prompt = customPrompt || defaultPrompt;

  return generateWithGemini(prompt, base64Image, mimeType);
}