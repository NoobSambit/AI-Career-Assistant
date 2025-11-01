import { RunnableSequence } from '@langchain/core/runnables';
import { HumanMessage } from '@langchain/core/messages';
import { getStructuredOutputModel } from '../client';
import { emailEnhancementPrompt } from '../prompts/email';
import { parseEmailResponse } from '../parsers/emailParser';

/**
 * Input interface for email enhancement chain
 */
export interface EmailChainInput {
  content: string;
  tone?: 'friendly' | 'formal' | 'assertive';
}

/**
 * Email enhancement chain
 * 
 * Pipeline:
 * 1. Format prompt with tone
 * 2. Invoke model
 * 3. Parse and validate output
 */
export const createEmailEnhancementChain = () => {
  return RunnableSequence.from([
    // Step 1: Format prompt
    async (input: EmailChainInput) => {
      console.log('[EmailChain] Starting enhancement for content length:', input.content.length);
      
      const formattedPrompt = await emailEnhancementPrompt.format({
        emailContent: input.content,
        tone: input.tone || 'professional',
      });
      
      return {
        prompt: formattedPrompt,
        originalTone: input.tone,
      };
    },
    
    // Step 2: Invoke model
    async (data: { prompt: string; originalTone?: string }) => {
      console.log('[EmailChain] Invoking model...');
      const model = getStructuredOutputModel();
      
      const response = await model.invoke([
        new HumanMessage(data.prompt),
      ]);
      
      console.log('[EmailChain] Model response received');
      
      return {
        rawResponse: response.content.toString(),
        originalTone: data.originalTone,
      };
    },
    
    // Step 3: Parse and validate
    async (data: { rawResponse: string; originalTone?: string }) => {
      console.log('[EmailChain] Parsing response...');
      
      try {
        const parsed = await parseEmailResponse(data.rawResponse);
        console.log('[EmailChain] Response parsed successfully');
        return parsed;
      } catch (error) {
        console.error('[EmailChain] Parsing failed:', error);
        throw new Error(`Email enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  ]);
};

/**
 * Singleton instance
 */
let _emailChainInstance: ReturnType<typeof createEmailEnhancementChain> | null = null;

/**
 * Get or create email enhancement chain instance
 */
export function getEmailEnhancementChain() {
  if (!_emailChainInstance) {
    _emailChainInstance = createEmailEnhancementChain();
  }
  return _emailChainInstance;
}
