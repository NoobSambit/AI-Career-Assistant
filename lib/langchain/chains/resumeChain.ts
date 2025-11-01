import { RunnableSequence } from '@langchain/core/runnables';
import { HumanMessage } from '@langchain/core/messages';
import { getStructuredOutputModel } from '../client';
import { resumeEnhancementPrompt, resumeEnhancementWithContextPrompt } from '../prompts/resume';
import { parseResumeResponse, getResumeFormatInstructions } from '../parsers/resumeParser';
import { calculateATSScore } from '@/lib/scoring';

/**
 * Context interface for resume enhancement
 */
export interface ResumeEnhancementContext {
  role?: string;
  industry?: string;
  companySize?: string;
  experienceLevel?: string;
  keywords?: string[];
}

/**
 * Input interface for resume enhancement chain
 */
export interface ResumeChainInput {
  content: string;
  context?: ResumeEnhancementContext;
}

/**
 * Resume enhancement chain
 * 
 * Pipeline:
 * 1. Calculate initial ATS score
 * 2. Format prompt with context
 * 3. Invoke model
 * 4. Parse and validate output
 * 5. Enrich with calculated scores
 */
export const createResumeEnhancementChain = () => {
  return RunnableSequence.from([
    // Step 1: Prepare input and calculate initial ATS score
    async (input: ResumeChainInput) => {
      console.log('[ResumeChain] Starting enhancement for content length:', input.content.length);
      
      const initialATS = calculateATSScore(input.content);
      console.log('[ResumeChain] Initial ATS score calculated:', initialATS.score);
      
      return {
        ...input,
        initialATS,
      };
    },
    
    // Step 2: Format prompt based on context availability
    async (data: ResumeChainInput & { initialATS: any }) => {
      const { content, context, initialATS } = data;
      
      let formattedPrompt: string;
      
      if (context && Object.keys(context).length > 0) {
        // Use context-aware prompt
        formattedPrompt = await resumeEnhancementWithContextPrompt.format({
          resumeContent: content,
          role: context.role || 'Not specified',
          industry: context.industry || 'General',
          companySize: context.companySize || 'Any',
          experienceLevel: context.experienceLevel || 'Mid-level',
          keywords: Array.isArray(context.keywords) ? context.keywords.join(', ') : (context.keywords || 'General skills'),
        });
        console.log('[ResumeChain] Using context-aware prompt');
      } else {
        // Use base prompt
        formattedPrompt = await resumeEnhancementPrompt.format({
          resumeContent: content,
        });
        console.log('[ResumeChain] Using base prompt');
      }
      
      const formatInstructions = getResumeFormatInstructions();
      formattedPrompt = `${formattedPrompt}\n\n${formatInstructions}`;

      return {
        prompt: formattedPrompt,
        initialATS,
      };
    },
    
    // Step 3: Invoke model
    async (data: { prompt: string; initialATS: any }) => {
      console.log('[ResumeChain] Invoking model...');
      const model = getStructuredOutputModel();
      
      const response = await model.invoke([
        new HumanMessage(data.prompt),
      ]);
      
      console.log('[ResumeChain] Model response received, length:', response.content.toString().length);
      
      return {
        rawResponse: response.content.toString(),
        initialATS: data.initialATS,
      };
    },
    
    // Step 4: Parse and validate
    async (data: { rawResponse: string; initialATS: any }) => {
      console.log('[ResumeChain] Parsing response...');
      
      try {
        const parsed = await parseResumeResponse(data.rawResponse);
        console.log('[ResumeChain] Response parsed successfully');
        
        // Enrich with initial ATS score
        if (parsed.assessment) {
          parsed.assessment.initialAtsScore = data.initialATS.score;
          parsed.assessment.atsCompatibility = data.initialATS.score;
        }
        
        return parsed;
      } catch (error) {
        console.error('[ResumeChain] Parsing failed:', error);
        throw new Error(`Resume enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  ]);
};

/**
 * Singleton instance of resume enhancement chain
 */
let _resumeChainInstance: ReturnType<typeof createResumeEnhancementChain> | null = null;

/**
 * Get or create resume enhancement chain instance
 */
export function getResumeEnhancementChain() {
  if (!_resumeChainInstance) {
    _resumeChainInstance = createResumeEnhancementChain();
  }
  return _resumeChainInstance;
}
