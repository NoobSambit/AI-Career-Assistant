import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { calculateATSScore, evaluateSTARStructure, assessEmailTone } from '@/lib/scoring';
import { parseDocument } from '@/lib/documentParser';

/**
 * Tool for calculating ATS compatibility scores
 */
export const atsScoreTool = new DynamicStructuredTool({
  name: 'calculate_ats_score',
  description: 'Calculate ATS (Applicant Tracking System) compatibility score for resume content. Returns score (0-100), analysis breakdown, and recommendations.',
  schema: z.object({
    content: z.string().describe('Resume text content to analyze for ATS compatibility'),
  }),
  func: async ({ content }) => {
    const result = calculateATSScore(content);
    return JSON.stringify(result);
  },
});

/**
 * Tool for evaluating STAR method structure in interview answers
 */
export const starEvaluationTool = new DynamicStructuredTool({
  name: 'evaluate_star_structure',
  description: 'Evaluate interview answer using STAR method framework (Situation, Task, Action, Result). Returns analysis of each component and overall score.',
  schema: z.object({
    answer: z.string().describe('Interview answer text to evaluate'),
  }),
  func: async ({ answer }) => {
    const result = evaluateSTARStructure(answer);
    return JSON.stringify(result);
  },
});

/**
 * Tool for assessing email tone and effectiveness
 */
export const emailToneAssessmentTool = new DynamicStructuredTool({
  name: 'assess_email_tone',
  description: 'Assess email tone, clarity, professionalism, and effectiveness. Compares original and rewritten versions.',
  schema: z.object({
    originalEmail: z.string().describe('Original email text'),
    rewrittenEmail: z.string().describe('Rewritten email text'),
    targetTone: z.string().describe('Target tone (friendly, formal, or assertive)'),
  }),
  func: async ({ originalEmail, rewrittenEmail, targetTone }) => {
    const result = assessEmailTone(originalEmail, rewrittenEmail, targetTone);
    return JSON.stringify(result);
  },
});

/**
 * Tool for parsing documents (PDF, DOCX, images)
 */
export const documentParserTool = new DynamicStructuredTool({
  name: 'parse_document',
  description: 'Parse and extract text from uploaded documents including PDF, DOCX, and image files using OCR when needed.',
  schema: z.object({
    fileBuffer: z.string().describe('Base64 encoded file buffer'),
    mimeType: z.string().describe('MIME type of the file'),
  }),
  func: async ({ fileBuffer, mimeType }) => {
    // Note: This tool is for demonstration; actual file parsing in chains
    // happens before chain invocation in the API routes
    return JSON.stringify({
      message: 'Document parsing happens in API route before chain invocation',
      supportedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'],
    });
  },
});

/**
 * Export all tools as an array for easy registration with agents
 */
export const allTools = [
  atsScoreTool,
  starEvaluationTool,
  emailToneAssessmentTool,
  documentParserTool,
];

/**
 * Tool registry for dynamic tool selection
 */
export const toolRegistry = {
  atsScore: atsScoreTool,
  starEvaluation: starEvaluationTool,
  emailTone: emailToneAssessmentTool,
  documentParser: documentParserTool,
};
