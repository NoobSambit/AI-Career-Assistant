import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { enhancedInterviewSchema } from '@/lib/schemas/enhancedInterview';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Structured output parser for interview preparation responses
 */
export const interviewOutputParser = StructuredOutputParser.fromZodSchema(enhancedInterviewSchema);

/**
 * Get format instructions for the model
 */
export function getInterviewFormatInstructions(): string {
  const jsonSchema = zodToJsonSchema(enhancedInterviewSchema);
  return `You must respond with a JSON object that matches this schema:\n${JSON.stringify(jsonSchema, null, 2)}`;
}

/**
 * Parse interview preparation response with retry logic
 */
export async function parseInterviewResponse(text: string, maxRetries = 2): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsed = await interviewOutputParser.parse(cleanText);
      return parsed;
    } catch (error) {
      lastError = error as Error;
      console.error(`Interview parsing attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries) {
        try {
          let cleanText = text.trim();
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          const jsonParsed = JSON.parse(cleanText);
          const validated = enhancedInterviewSchema.parse(jsonParsed);
          return validated;
        } catch (fallbackError) {
          continue;
        }
      }
    }
  }
  
  throw new Error(`Failed to parse interview response after ${maxRetries + 1} attempts: ${lastError?.message}`);
}
