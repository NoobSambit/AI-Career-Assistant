/**
 * Evaluation and testing utilities for LangChain chains
 * 
 * This module provides regression tests and validation functions
 * to ensure chain outputs meet quality standards.
 */

import { enhancedResumeSchema } from '@/lib/schemas/enhancedResume';
import { enhancedEmailSchema } from '@/lib/schemas/enhancedEmail';
import { enhancedInterviewSchema } from '@/lib/schemas/enhancedInterview';

/**
 * Sample test data
 */
export const SAMPLE_RESUME = `
John Doe
Software Engineer
john.doe@email.com | 555-123-4567 | San Francisco, CA

EXPERIENCE
Senior Software Engineer, TechCorp (2020-2023)
- Developed web applications using React and Node.js
- Led team of 5 engineers
- Improved performance by 40%

EDUCATION
BS Computer Science, University of California (2016-2020)
GPA: 3.8/4.0

SKILLS
JavaScript, React, Node.js, Python, AWS
`.trim();

export const SAMPLE_EMAIL = `
Hi Sarah,

I wanted to follow up on our meeting yesterday. Can you send me the report when you get a chance?

Thanks,
John
`.trim();

export const SAMPLE_INTERVIEW = {
  question: 'Tell me about a time when you had to deal with a difficult team member.',
  answer: 'I had a team member who consistently missed deadlines. I scheduled a one-on-one meeting to understand the root cause. We created an action plan together and I provided additional support. The team member improved significantly.',
};

/**
 * Validation functions
 */

export function validateResumeOutput(output: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    // Schema validation
    enhancedResumeSchema.parse(output);
  } catch (error) {
    errors.push(`Schema validation failed: ${error}`);
    return { valid: false, errors };
  }
  
  // Business logic validation
  if (!output.assessment) {
    errors.push('Missing assessment field');
  } else {
    if (typeof output.assessment.overallScore !== 'number' || output.assessment.overallScore < 0 || output.assessment.overallScore > 100) {
      errors.push('Invalid overallScore: must be number between 0-100');
    }
    
    if (!Array.isArray(output.assessment.strengths) || output.assessment.strengths.length === 0) {
      errors.push('Strengths array is empty');
    }
    
    if (!Array.isArray(output.assessment.weaknesses)) {
      errors.push('Weaknesses must be an array');
    }
    
    if (typeof output.assessment.atsImprovement !== 'number') {
      errors.push('atsImprovement must be a number');
    }
  }
  
  if (!output.enhancedResume) {
    errors.push('Missing enhancedResume field');
  } else {
    if (!output.enhancedResume.personalInfo || !output.enhancedResume.personalInfo.name) {
      errors.push('Missing personal info name');
    }
    
    if (!output.enhancedResume.professionalSummary) {
      errors.push('Missing professional summary');
    }
  }
  
  if (!output.atsAnalysis) {
    errors.push('Missing atsAnalysis field');
  }
  
  if (!output.improvements || !Array.isArray(output.improvements)) {
    errors.push('improvements must be an array');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateEmailOutput(output: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    enhancedEmailSchema.parse(output);
  } catch (error) {
    errors.push(`Schema validation failed: ${error}`);
    return { valid: false, errors };
  }
  
  if (!output.assessment) {
    errors.push('Missing assessment field');
  }
  
  if (!output.enhancedEmail) {
    errors.push('Missing enhancedEmail field');
  } else {
    if (!output.enhancedEmail.subject) {
      errors.push('Missing email subject');
    }
    if (!output.enhancedEmail.body) {
      errors.push('Missing email body');
    }
  }
  
  if (!output.psychologyAnalysis) {
    errors.push('Missing psychologyAnalysis field');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateInterviewOutput(output: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    enhancedInterviewSchema.parse(output);
  } catch (error) {
    errors.push(`Schema validation failed: ${error}`);
    return { valid: false, errors };
  }
  
  if (!output.assessment) {
    errors.push('Missing assessment field');
  }
  
  if (!output.enhancedAnswer) {
    errors.push('Missing enhancedAnswer field');
  }
  
  if (!output.improvements || !Array.isArray(output.improvements)) {
    errors.push('improvements must be an array');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Performance benchmarks (in milliseconds)
 */
export const PERFORMANCE_BENCHMARKS = {
  resume: {
    p50: 8000,   // 8 seconds
    p95: 15000,  // 15 seconds
    p99: 25000,  // 25 seconds
  },
  email: {
    p50: 5000,   // 5 seconds
    p95: 10000,  // 10 seconds
    p99: 15000,  // 15 seconds
  },
  interview: {
    p50: 6000,   // 6 seconds
    p95: 12000,  // 12 seconds
    p99: 18000,  // 18 seconds
  },
};

/**
 * Run all validation tests
 */
export async function runValidationTests(
  resumeOutput?: any,
  emailOutput?: any,
  interviewOutput?: any
): Promise<{ passed: number; failed: number; details: any }> {
  const results = {
    passed: 0,
    failed: 0,
    details: {} as any,
  };
  
  if (resumeOutput) {
    const validation = validateResumeOutput(resumeOutput);
    if (validation.valid) {
      results.passed++;
    } else {
      results.failed++;
    }
    results.details.resume = validation;
  }
  
  if (emailOutput) {
    const validation = validateEmailOutput(emailOutput);
    if (validation.valid) {
      results.passed++;
    } else {
      results.failed++;
    }
    results.details.email = validation;
  }
  
  if (interviewOutput) {
    const validation = validateInterviewOutput(interviewOutput);
    if (validation.valid) {
      results.passed++;
    } else {
      results.failed++;
    }
    results.details.interview = validation;
  }
  
  return results;
}
