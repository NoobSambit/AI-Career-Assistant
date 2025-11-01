import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { enhancedEmailSchema } from '@/lib/schemas/enhancedEmail';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Structured output parser for email enhancement responses
 */
export const emailOutputParser = StructuredOutputParser.fromZodSchema(enhancedEmailSchema);

/**
 * Get format instructions for the model
 */
export function getEmailFormatInstructions(): string {
  const jsonSchema = zodToJsonSchema(enhancedEmailSchema);
  return `You must respond with a JSON object that matches this schema:\n${JSON.stringify(jsonSchema, null, 2)}`;
}

/**
 * Parse email enhancement response with retry logic
 */
export async function parseEmailResponse(text: string, maxRetries = 2): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsed = await emailOutputParser.parse(cleanText);
      return parsed;
    } catch (error) {
      lastError = error as Error;
      console.error(`Email parsing attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries) {
        try {
          let cleanText = text.trim();
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          const jsonParsed = JSON.parse(cleanText);
          const validated = enhancedEmailSchema.parse(jsonParsed);
          return validated;
        } catch (fallbackError) {
          continue;
        }
      }
    }
  }
  
  throw new Error(`Failed to parse email response after ${maxRetries + 1} attempts: ${lastError?.message}`);
}
