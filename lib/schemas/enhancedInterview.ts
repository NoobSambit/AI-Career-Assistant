import { z } from 'zod';

// STAR Analysis structure
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

// Enhanced interview response structure
export const enhancedInterviewSchema = z.object({
  // Overall assessment
  assessment: z.object({
    overallScore: z.number().min(0).max(10),
    grade: z.enum(['Excellent', 'Good', 'Needs Improvement', 'Poor']),
    summary: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  }),

  // STAR method analysis (for behavioral questions with answers)
  starAnalysis: StarAnalysisSchema.optional(),

  // Enhanced answer suggestion
  enhancedAnswer: z.object({
    title: z.string(),
    content: z.string(),
    keyPoints: z.array(z.string()),
    structure: z.array(z.object({
      section: z.string(),
      content: z.string(),
    })),
  }),

  // Specific improvements
  improvements: z.array(z.object({
    category: z.string(),
    title: z.string(),
    description: z.string(),
    impact: z.enum(['High', 'Medium', 'Low']),
    example: z.string().optional(),
  })),

  // Confidence building tips
  confidenceTips: z.array(z.object({
    title: z.string(),
    description: z.string(),
    actionSteps: z.array(z.string()),
  })),

  // Follow-up questions to prepare for
  followUpQuestions: z.array(z.string()),
});

export type EnhancedInterview = z.infer<typeof enhancedInterviewSchema>;
export type StarAnalysis = z.infer<typeof StarAnalysisSchema>;
export type StarComponent = z.infer<typeof StarComponentSchema>;
