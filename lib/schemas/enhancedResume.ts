import { z } from 'zod';

// Comprehensive resume enhancement schema matching email agent quality
export const enhancedResumeSchema = z.object({
  // Overall assessment (like email agent)
  assessment: z.object({
    overallScore: z.number().min(0).max(100),
    grade: z.string(),
    atsCompatibility: z.number().min(0).max(100),
    initialAtsScore: z.number().min(0).max(100),
    improvedAtsScore: z.number().min(0).max(100),
    atsImprovement: z.number(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    summary: z.string(),
  }),

  // Complete enhanced resume
  enhancedResume: z.object({
    personalInfo: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      location: z.string(),
      linkedin: z.string().optional(),
      portfolio: z.string().optional(),
    }),
    professionalSummary: z.string(),
    experience: z.array(z.object({
      company: z.string(),
      role: z.string(),
      period: z.string(),
      location: z.string().optional(),
      bullets: z.array(z.string()),
      keyAchievements: z.array(z.string()).optional(),
    })),
    education: z.array(z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string(),
      gpa: z.string().nullable().optional(),
      achievements: z.array(z.string()).optional(),
    })),
    skills: z.object({
      technical: z.array(z.string()),
      tools: z.array(z.string()),
      soft: z.array(z.string()),
      certifications: z.array(z.string()).optional(),
    }),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      duration: z.string().optional(),
      highlights: z.array(z.string()),
      link: z.string().optional(),
    })).optional(),
  }),

  // ATS Analysis
  atsAnalysis: z.object({
    score: z.number().min(0).max(100),
    grade: z.string(),
    keywordDensity: z.number().min(0).max(100),
    missingKeywords: z.array(z.string()),
    recommendedKeywords: z.array(z.string()),
    sectionOptimization: z.object({
      contact: z.object({
        score: z.number().min(0).max(100),
        suggestions: z.array(z.string()),
      }),
      summary: z.object({
        score: z.number().min(0).max(100),
        suggestions: z.array(z.string()),
      }),
      experience: z.object({
        score: z.number().min(0).max(100),
        suggestions: z.array(z.string()),
      }),
      skills: z.object({
        score: z.number().min(0).max(100),
        suggestions: z.array(z.string()),
      }),
      education: z.object({
        score: z.number().min(0).max(100),
        suggestions: z.array(z.string()),
      }),
    }),
  }),

  // Industry-specific analysis
  industryAnalysis: z.object({
    industry: z.string(),
    roleAlignment: z.number().min(0).max(100),
    marketDemand: z.number().min(0).max(100),
    competitiveAdvantage: z.array(z.string()),
    industryTrends: z.array(z.string()),
    salaryInsights: z.object({
      range: z.string().nullable().optional(),
      factors: z.array(z.string()),
    }),
  }),

  // Detailed improvements with business impact
  improvements: z.array(z.object({
    title: z.string(),
    description: z.string(),
    impact: z.string(), // 'high', 'medium', 'low'
    effort: z.string(), // 'low', 'medium', 'high'
    category: z.string(),
    priority: z.number(),
    examples: z.object({
      before: z.string(),
      after: z.string(),
    }).optional(),
  })),

  // Role-specific optimizations
  roleOptimization: z.object({
    targetRole: z.string().nullable().optional(),
    matchPercentage: z.number().min(0).max(100),
    keywordGaps: z.array(z.string()),
    recommendedSections: z.array(z.string()),
    industrySpecificTips: z.array(z.string()),
  }),

  // Career progression analysis
  careerAnalysis: z.object({
    currentLevel: z.string(),
    progressionPath: z.object({
      nextRole: z.string().nullable().optional(),
      timeframe: z.string().nullable().optional(),
      requirements: z.array(z.string()),
    }),
    skillGaps: z.array(z.object({
      skill: z.string(),
      importance: z.string(),
      timeToAcquire: z.string(),
    })),
    nextSteps: z.array(z.string()),
  }),

  // Quantification and metrics analysis
  metricsAnalysis: z.object({
    quantificationScore: z.number().min(0).max(100),
    impactStatements: z.number(),
    missingMetrics: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),

  // Formatting and structure analysis
  structureAnalysis: z.object({
    formatScore: z.number().min(0).max(100),
    readabilityScore: z.number().min(0).max(100),
    atsCompatibility: z.number().min(0).max(100),
    sections: z.object({
      missing: z.array(z.string()),
      present: z.array(z.string()),
      recommended: z.array(z.string()),
    }),
    improvements: z.array(z.string()),
  }),
});

export type EnhancedResume = z.infer<typeof enhancedResumeSchema>;
export type ATSAnalysis = z.infer<typeof enhancedResumeSchema>['atsAnalysis'];
export type IndustryAnalysis = z.infer<typeof enhancedResumeSchema>['industryAnalysis'];
export type RoleOptimization = z.infer<typeof enhancedResumeSchema>['roleOptimization'];
