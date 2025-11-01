import { z } from 'zod';

const AnswerSectionSchema = z.object({
  section: z.string(),
  content: z.string(),
});

const AnswerDetailsSchema = z.object({
  title: z.string(),
  content: z.string(),
  keyPoints: z.array(z.string()),
  structure: z.array(AnswerSectionSchema),
});

const StarComponentSchema = z.object({
  strength: z.number().min(0).max(10),
  feedback: z.string(),
  examples: z.array(z.string()).optional(),
});

const StarAnalysisSchema = z.object({
  situation: StarComponentSchema,
  task: StarComponentSchema,
  action: StarComponentSchema,
  result: StarComponentSchema,
});

const AssessmentSchema = z.object({
  overallScore: z.number().min(0).max(10),
  grade: z.enum(['Excellent', 'Good', 'Needs Improvement', 'Poor']),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

const ImprovementSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  impact: z.enum(['High', 'Medium', 'Low']),
  example: z.string().optional(),
});

const ConfidenceTipSchema = z.object({
  title: z.string(),
  description: z.string(),
  actionSteps: z.array(z.string()),
});

const BaseResponseSchema = z.object({
  answerSource: z.enum(['user', 'assistant']),
  improvements: z.array(ImprovementSchema),
  confidenceTips: z.array(ConfidenceTipSchema),
  followUpQuestions: z.array(z.string()),
});

const EnhancedAnswerSchema = BaseResponseSchema.extend({
  answerSource: z.literal('user'),
  assessment: AssessmentSchema,
  starAnalysis: StarAnalysisSchema.optional(),
  enhancedAnswer: AnswerDetailsSchema,
});

const DraftAnswerSchema = BaseResponseSchema.extend({
  answerSource: z.literal('assistant'),
  draftAnswer: AnswerDetailsSchema,
  assessment: z.never().optional(),
  starAnalysis: z.never().optional(),
  enhancedAnswer: z.never().optional(),
});

export const enhancedInterviewSchema = z.union([EnhancedAnswerSchema, DraftAnswerSchema]);

export type EnhancedInterview = z.infer<typeof enhancedInterviewSchema>;
export type Assessment = z.infer<typeof AssessmentSchema>;
export type StarAnalysis = z.infer<typeof StarAnalysisSchema>;
export type StarComponent = z.infer<typeof StarComponentSchema>;
export type AnswerDetails = z.infer<typeof AnswerDetailsSchema>;
