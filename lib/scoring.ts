/**
 * Scoring and evaluation utilities for AI agents
 */

/**
 * Calculate ATS compatibility score for resume content
 * Updated with more realistic and comprehensive scoring criteria
 */
export function calculateATSScore(resumeContent: string) {
  const content = resumeContent.toLowerCase();
  const originalContent = resumeContent;
  let score = 0;
  const recommendations: string[] = [];
  const analysis = {
    keywords: 0,
    formatting: 0,
    structure: 0,
    quantification: 0
  };

  // 1. KEYWORDS & ACTION VERBS (25 points)
  const strongActionVerbs = [
    'led', 'managed', 'developed', 'created', 'implemented', 'optimized', 'delivered', 'achieved', 
    'increased', 'reduced', 'architected', 'designed', 'launched', 'streamlined', 'spearheaded',
    'orchestrated', 'pioneered', 'transformed', 'accelerated', 'executed', 'generated', 'established',
    'built', 'scaled', 'automated', 'improved', 'enhanced', 'collaborated', 'coordinated'
  ];
  
  const weakWords = ['responsible for', 'worked on', 'helped with', 'assisted', 'involved in', 'participated'];
  const foundStrongVerbs = strongActionVerbs.filter(verb => content.includes(verb));
  const foundWeakWords = weakWords.filter(word => content.includes(word));
  
  // Score based on strong verbs, penalize weak language
  let keywordScore = Math.min(foundStrongVerbs.length * 2, 25);
  keywordScore -= foundWeakWords.length * 2; // Penalty for weak language
  analysis.keywords = Math.max(keywordScore, 0);
  score += analysis.keywords;

  if (foundStrongVerbs.length < 6) {
    recommendations.push('Use more strong action verbs (Led, Optimized, Delivered) instead of weak phrases');
  }
  if (foundWeakWords.length > 0) {
    recommendations.push('Replace weak phrases like "responsible for" with specific action verbs');
  }

  // 2. QUANTIFICATION & METRICS (30 points)
  const metricPatterns = [
    /\d+[%]/g,                    // Percentages: 25%
    /\$\d+[kmb]?/g,              // Money: $50k, $1.2M
    /\d+[kmb]\+?/g,              // Large numbers: 100k+, 2.5M
    /\d+\.\d+[sx]/g,             // Performance metrics: 2.1s, 4.5x
    /\d+:\d+/g,                  // Time ratios: 3:1
    /\d+\s?(hours?|days?|weeks?|months?|years?)/g, // Time periods
    /\d+\s?(users?|customers?|clients?|employees?|projects?|features?)/g // Quantities
  ];
  
  let totalMetrics = 0;
  metricPatterns.forEach(pattern => {
    const matches = originalContent.match(pattern) || [];
    totalMetrics += matches.length;
  });
  
  // Bonus for diverse metric types
  const uniqueMetricTypes = metricPatterns.filter(pattern => 
    (originalContent.match(pattern) || []).length > 0
  ).length;
  
  analysis.quantification = Math.min(totalMetrics * 3 + uniqueMetricTypes * 2, 30);
  score += analysis.quantification;

  if (totalMetrics < 8) {
    recommendations.push('Add specific metrics and numbers to quantify your achievements (%, $, time, volume)');
  }

  // 3. STRUCTURE & SECTIONS (20 points)
  const essentialSections = ['experience', 'skills'];
  const commonSections = ['summary', 'education', 'projects', 'certifications', 'achievements'];
  
  const foundEssential = essentialSections.filter(section => content.includes(section));
  const foundCommon = commonSections.filter(section => content.includes(section));
  
  // Must have essential sections, bonus for additional
  let structureScore = foundEssential.length * 8; // 16 points max for essentials
  structureScore += Math.min(foundCommon.length * 1, 4); // Up to 4 bonus points
  
  analysis.structure = Math.min(structureScore, 20);
  score += analysis.structure;

  if (foundEssential.length < 2) {
    recommendations.push('Include essential sections: Work Experience and Skills');
  }
  if (foundCommon.length < 2) {
    recommendations.push('Consider adding Professional Summary and Education sections');
  }

  // 4. FORMATTING & READABILITY (25 points)
  const lines = originalContent.split('\n');
  const bulletPoints = (originalContent.match(/[-•·]/g) || []).length;
  const allCapsWords = (originalContent.match(/\b[A-Z]{3,}\b/g) || []).length;
  const longLines = lines.filter(line => line.length > 120).length;
  
  let formatScore = 0;
  
  // Bullet points (up to 10 points)
  formatScore += Math.min(bulletPoints * 1.5, 10);
  
  // Penalty for excessive ALL CAPS (ATS systems prefer normal case)
  formatScore -= Math.min(allCapsWords * 1, 5);
  
  // Penalty for overly long lines (readability)
  formatScore -= Math.min(longLines * 0.5, 3);
  
  // Bonus for proper length (not too short, not too long)
  const wordCount = originalContent.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800) {
    formatScore += 5;
  }
  
  // Bonus for consistent formatting patterns
  const datePatterns = originalContent.match(/\d{4}[-–]\d{4}|\d{4}[-–]present/gi) || [];
  if (datePatterns.length >= 2) {
    formatScore += 3;
  }
  
  analysis.formatting = Math.max(Math.min(formatScore, 25), 0);
  score += analysis.formatting;

  if (bulletPoints < 6) {
    recommendations.push('Use bullet points to improve readability and ATS parsing');
  }
  if (allCapsWords > 3) {
    recommendations.push('Avoid excessive ALL CAPS text - use normal capitalization');
  }
  if (wordCount < 300) {
    recommendations.push('Expand your resume content - aim for 300-800 words total');
  }
  if (wordCount > 800) {
    recommendations.push('Consider condensing content - keep resume concise and focused');
  }

  const finalScore = Math.min(Math.max(score, 0), 100);
  
  return {
    score: finalScore,
    analysis,
    recommendations,
    grade: finalScore >= 85 ? 'Excellent' : 
           finalScore >= 70 ? 'Good' : 
           finalScore >= 50 ? 'Fair' : 'Needs Improvement'
  };
}

/**
 * Evaluate STAR method structure in interview answers
 */
export function evaluateSTARStructure(answer: string) {
  const content = answer.toLowerCase();
  const analysis = {
    situation: { present: false, strength: 0, feedback: '' },
    task: { present: false, strength: 0, feedback: '' },
    action: { present: false, strength: 0, feedback: '' },
    result: { present: false, strength: 0, feedback: '' }
  };

  // Situation indicators
  const situationWords = ['situation', 'when', 'where', 'context', 'background', 'at my previous job', 'while working', 'during my time'];
  const situationFound = situationWords.some(word => content.includes(word));
  analysis.situation.present = situationFound;
  analysis.situation.strength = situationFound ? 8 : 0;
  analysis.situation.feedback = situationFound ? 
    'Good context provided' : 
    'Add more background context about the situation';

  // Task indicators
  const taskWords = ['task', 'responsibility', 'needed to', 'had to', 'my role was', 'assigned to', 'objective', 'goal'];
  const taskFound = taskWords.some(word => content.includes(word));
  analysis.task.present = taskFound;
  analysis.task.strength = taskFound ? 7 : 0;
  analysis.task.feedback = taskFound ? 
    'Clear task definition' : 
    'Clarify what your specific role or task was';

  // Action indicators
  const actionWords = ['i did', 'i implemented', 'i created', 'i led', 'i organized', 'my approach', 'i decided', 'i developed', 'i coordinated'];
  const actionFound = actionWords.some(word => content.includes(word));
  analysis.action.present = actionFound;
  analysis.action.strength = actionFound ? 8 : 0;
  analysis.action.feedback = actionFound ? 
    'Good action description' : 
    'Describe the specific actions you took';

  // Result indicators
  const resultWords = ['result', 'outcome', 'achieved', 'increased', 'reduced', 'improved', 'success', 'completed', 'delivered'];
  const resultFound = resultWords.some(word => content.includes(word));
  analysis.result.present = resultFound;
  analysis.result.strength = resultFound ? 9 : 0;
  analysis.result.feedback = resultFound ? 
    'Clear results mentioned' : 
    'Add specific, quantifiable results and outcomes';

  const overallScore = Math.round(
    (analysis.situation.strength + analysis.task.strength + 
     analysis.action.strength + analysis.result.strength) / 4
  );

  return {
    analysis,
    overallScore,
    completeness: Object.values(analysis).filter(item => item.present).length,
    recommendations: Object.values(analysis)
      .filter(item => !item.present)
      .map(item => item.feedback)
  };
}

/**
 * Assess email tone and effectiveness
 */
export function assessEmailTone(originalEmail: string, rewrittenEmail: string, targetTone: string) {
  const analysis = {
    clarity: 0,
    professionalism: 0,
    toneConsistency: 0,
    callToAction: 0
  };

  const content = rewrittenEmail.toLowerCase();

  // Clarity assessment (25 points)
  const sentences = rewrittenEmail.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
  analysis.clarity = avgSentenceLength < 100 ? 25 : avgSentenceLength < 150 ? 20 : 15;

  // Professionalism assessment (25 points)
  const professionalWords = ['please', 'thank you', 'regards', 'sincerely', 'appreciate', 'kindly', 'best'];
  const foundProfessional = professionalWords.filter(word => content.includes(word));
  analysis.professionalism = Math.min(foundProfessional.length * 4, 25);

  // Tone consistency (25 points)
  const toneWords = {
    friendly: ['hope', 'pleased', 'happy', 'excited', 'looking forward', 'wonderful', 'great'],
    formal: ['respectfully', 'formally', 'officially', 'pursuant', 'accordingly', 'hereby', 'therefore'],
    assertive: ['require', 'expect', 'need', 'must', 'deadline', 'urgent', 'immediate']
  };

  const targetWords = toneWords[targetTone as keyof typeof toneWords] || [];
  const foundToneWords = targetWords.filter(word => content.includes(word));
  analysis.toneConsistency = Math.min(foundToneWords.length * 5, 25);

  // Call to action assessment (25 points)
  const ctaWords = ['please', 'could you', 'would you', 'let me know', 'respond', 'reply', 'confirm', 'schedule'];
  const foundCTA = ctaWords.filter(word => content.includes(word));
  analysis.callToAction = foundCTA.length > 0 ? 25 : 0;

  const totalScore = Object.values(analysis).reduce((sum, score) => sum + score, 0);

  return {
    score: totalScore,
    analysis,
    grade: totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : totalScore >= 40 ? 'Fair' : 'Needs Improvement',
    improvements: [
      analysis.clarity < 20 ? 'Simplify sentence structure for better clarity' : null,
      analysis.professionalism < 20 ? 'Add more professional courtesy phrases' : null,
      analysis.toneConsistency < 20 ? `Strengthen ${targetTone} tone with appropriate language` : null,
      analysis.callToAction < 20 ? 'Include a clear call to action' : null
    ].filter(Boolean)
  };
}