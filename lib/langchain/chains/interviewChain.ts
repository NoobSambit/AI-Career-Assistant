import { RunnableSequence } from '@langchain/core/runnables';
import { HumanMessage } from '@langchain/core/messages';
import { getStructuredOutputModel } from '../client';
import { interviewPreparationPrompt } from '../prompts/interview';
import { parseInterviewResponse } from '../parsers/interviewParser';
import { evaluateSTARStructure } from '@/lib/scoring';

/**
 * Input interface for interview preparation chain
 */
export interface InterviewChainInput {
  question: string;
  answer?: string;
  questionType?: 'behavioral' | 'technical' | 'situational';
}

/**
 * Interview preparation chain
 * 
 * Pipeline:
 * 1. Evaluate STAR structure if answer provided
 * 2. Format prompt
 * 3. Invoke model
 * 4. Parse and validate output
 */
export const createInterviewPreparationChain = () => {
  return RunnableSequence.from([
    // Step 1: Evaluate STAR structure if answer provided
    async (input: InterviewChainInput) => {
      console.log('[InterviewChain] Starting preparation for question');
      
      let starEvaluation = null;
      if (input.answer) {
        starEvaluation = evaluateSTARStructure(input.answer);
        console.log('[InterviewChain] STAR evaluation completed:', starEvaluation.overallScore);
      }
      
      return {
        ...input,
        starEvaluation,
      };
    },
    
    // Step 2: Format prompt
    async (data: InterviewChainInput & { starEvaluation: any }) => {
      const formattedPrompt = await interviewPreparationPrompt.format({
        question: data.question,
        answer: data.answer || 'Not provided',
        questionType: data.questionType || 'behavioral',
      });
      
      return {
        prompt: formattedPrompt,
        starEvaluation: data.starEvaluation,
      };
    },
    
    // Step 3: Invoke model
    async (data: { prompt: string; starEvaluation: any }) => {
      console.log('[InterviewChain] Invoking model...');
      const model = getStructuredOutputModel();
      
      const response = await model.invoke([
        new HumanMessage(data.prompt),
      ]);
      
      console.log('[InterviewChain] Model response received');
      
      return {
        rawResponse: response.content.toString(),
        starEvaluation: data.starEvaluation,
      };
    },
    
    // Step 4: Parse and validate
    async (data: { rawResponse: string; starEvaluation: any }) => {
      console.log('[InterviewChain] Parsing response...');
      
      try {
        const parsed = await parseInterviewResponse(data.rawResponse);
        console.log('[InterviewChain] Response parsed successfully');
        
        // Enrich with STAR evaluation if available
        if (data.starEvaluation && !parsed.starAnalysis) {
          parsed.starAnalysis = data.starEvaluation.analysis;
        }
        
        return parsed;
      } catch (error) {
        console.error('[InterviewChain] Parsing failed:', error);
        throw new Error(`Interview preparation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  ]);
};

/**
 * Singleton instance
 */
let _interviewChainInstance: ReturnType<typeof createInterviewPreparationChain> | null = null;

/**
 * Get or create interview preparation chain instance
 */
export function getInterviewPreparationChain() {
  if (!_interviewChainInstance) {
    _interviewChainInstance = createInterviewPreparationChain();
  }
  return _interviewChainInstance;
}
