import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { enhancedResumeSchema } from '@/lib/schemas/enhancedResume';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Structured output parser for resume enhancement responses
 * Guarantees JSON conformance with the enhancedResumeSchema
 */
export const resumeOutputParser = StructuredOutputParser.fromZodSchema(enhancedResumeSchema);

/**
 * Get format instructions for the model
 * This should be appended to prompts to guide JSON generation
 */
export function getResumeFormatInstructions(): string {
  const jsonSchema = zodToJsonSchema(enhancedResumeSchema);
  return `You must respond with a JSON object that matches this schema:\n${JSON.stringify(jsonSchema, null, 2)}`;
}

/**
 * Parse resume enhancement response with retry logic
 * @param text - Raw model output
 * @param maxRetries - Maximum number of retry attempts
 * @returns Validated and parsed resume data
 */
export async function parseResumeResponse(text: string, maxRetries = 2): Promise<any> {
  let lastError: Error | null = null;
  
  const sanitizeNulls = (value: any): any => {
    if (value === null || value === undefined) {
      return 'Not provided';
    }

    if (Array.isArray(value)) {
      return value.map((item) => sanitizeNulls(item)).filter((item) => item !== undefined);
    }

    if (value && typeof value === 'object') {
      const result: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        const sanitized = sanitizeNulls(val);
        if (sanitized !== undefined) {
          result[key] = sanitized;
        }
      }
      return result;
    }

    return value;
  };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Strip markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Parse using the structured output parser
      const sanitized = sanitizeNulls(JSON.parse(cleanText));
      const parsed = await resumeOutputParser.parse(sanitized);
      return parsed;
    } catch (error) {
      lastError = error as Error;
      
      // On parse failure, log for debugging
      console.error(`Resume parsing attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log('Retrying with cleaned text...');
        // Try basic JSON parse as fallback
        try {
          let cleanText = text.trim();
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          const jsonParsed = JSON.parse(cleanText);
          const sanitized = sanitizeNulls(jsonParsed);
          // Validate against schema
          const validated = enhancedResumeSchema.parse(sanitized);
          return validated;
        } catch (fallbackError) {
          // Continue to next retry
          continue;
        }
      }
    }
  }
  
  throw new Error(`Failed to parse resume response after ${maxRetries + 1} attempts: ${lastError?.message}`);
}
