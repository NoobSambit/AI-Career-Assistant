import { z } from 'zod';

// Email enhancement with unique features not available elsewhere
export const enhancedEmailSchema = z.object({
  // Overall email assessment
  assessment: z.object({
    overallScore: z.number().min(0).max(10),
    grade: z.enum(['Excellent', 'Good', 'Needs Improvement', 'Poor']),
    summary: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    predictedResponseRate: z.number().min(0).max(100), // UNIQUE: AI-predicted response likelihood
  }),

  // Enhanced email content
  enhancedEmail: z.object({
    subject: z.string(),
    greeting: z.string(),
    body: z.string(),
    closing: z.string(),
    signature: z.string().optional(),
    keyChanges: z.array(z.string()),
    wordCount: z.number(),
    readingTime: z.string(), // e.g., "30 seconds"
  }),

  // UNIQUE: Psychological impact analysis
  psychologyAnalysis: z.object({
    persuasionTechniques: z.array(z.object({
      technique: z.string(), // e.g., "Reciprocity", "Social Proof", "Urgency"
      application: z.string(),
      effectiveness: z.enum(['High', 'Medium', 'Low']),
    })),
    emotionalTone: z.object({
      primary: z.string(), // e.g., "Professional", "Urgent", "Friendly"
      secondary: z.array(z.string()),
      sentiment: z.number().min(-1).max(1), // -1 negative, 0 neutral, 1 positive
    }),
    cognitiveLoad: z.enum(['Low', 'Medium', 'High']), // How much mental effort to read
    actionClarity: z.number().min(0).max(10), // How clear the call-to-action is
  }),

  // UNIQUE: Cultural and context adaptation
  culturalAdaptation: z.object({
    communicationStyle: z.string(), // e.g., "Direct Western", "High-context Asian", "Relationship-first Latin"
    formalityLevel: z.number().min(1).max(10),
    culturalConsiderations: z.array(z.string()),
    timeZoneOptimization: z.string().optional(), // Best time to send
  }),

  // UNIQUE: Email deliverability and engagement optimization
  deliverabilityAnalysis: z.object({
    spamRisk: z.enum(['Low', 'Medium', 'High']),
    spamTriggers: z.array(z.string()),
    engagementFactors: z.array(z.object({
      factor: z.string(),
      impact: z.enum(['Positive', 'Neutral', 'Negative']),
      suggestion: z.string(),
    })),
    mobileOptimization: z.number().min(0).max(10),
  }),

  // Advanced improvements categorized by impact
  improvements: z.array(z.object({
    category: z.string(), // e.g., "Clarity", "Persuasion", "Structure", "Tone"
    title: z.string(),
    description: z.string(),
    impact: z.enum(['High', 'Medium', 'Low']),
    effort: z.enum(['Low', 'Medium', 'High']), // Implementation effort
    example: z.string().optional(),
    businessImpact: z.string(), // e.g., "Increases response rate by 15%"
  })),

  // UNIQUE: Alternative versions for A/B testing
  alternatives: z.array(z.object({
    version: z.string(), // e.g., "Version A: Direct", "Version B: Relationship-focused"
    subject: z.string(),
    body: z.string(),
    rationale: z.string(),
    expectedOutcome: z.string(),
  })),

  // UNIQUE: Follow-up strategy
  followUpStrategy: z.object({
    timeline: z.array(z.object({
      day: z.number(),
      action: z.string(),
      template: z.string(),
    })),
    escalationPath: z.array(z.string()),
    responseScenarios: z.array(z.object({
      scenario: z.string(), // e.g., "No response", "Positive response", "Objection"
      nextSteps: z.array(z.string()),
    })),
  }),

  // UNIQUE: Industry-specific optimizations
  industryInsights: z.object({
    industry: z.string(),
    bestPractices: z.array(z.string()),
    commonMistakes: z.array(z.string()),
    benchmarks: z.object({
      averageResponseRate: z.number(),
      optimalLength: z.string(),
      bestSendTimes: z.array(z.string()),
    }),
  }),
});

export type EnhancedEmail = z.infer<typeof enhancedEmailSchema>;
export type PsychologyAnalysis = z.infer<typeof enhancedEmailSchema>['psychologyAnalysis'];
export type CulturalAdaptation = z.infer<typeof enhancedEmailSchema>['culturalAdaptation'];
export type DeliverabilityAnalysis = z.infer<typeof enhancedEmailSchema>['deliverabilityAnalysis'];
