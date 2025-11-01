import { NextRequest } from 'next/server';
import { getInterviewPreparationChain } from '@/lib/langchain/chains/interviewChain';
import { LangChainConfigError, LangChainQuotaError, LangChainTimeoutError, normalizeLangChainError } from '@/lib/langchain/client';
import { jsonOk, jsonBadRequest, jsonTooManyRequests, jsonServerError, jsonUnauthorized, jsonServiceUnavailable } from '@/lib/errors';
import { requestId, logError } from '@/lib/log';
import { checkRateLimit } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/security';
import { z } from 'zod';

export const runtime = 'nodejs';

const InterviewRequestSchema = z.object({
  question: z.string().min(1).max(1000),
  answer: z.string().max(5000).optional(),
  question_type: z.enum(['behavioral', 'technical', 'situational']).optional(),
});

/**
 * LangChain-powered interview preparation endpoint
 */
export async function POST(request: NextRequest) {
  const rid = requestId();
  const route = '/api/interview';
  const ip = getClientIp(request);
  
  const rl = checkRateLimit(ip, route);
  if (!rl.allowed) {
    return jsonTooManyRequests(rid);
  }
  
  try {
    const body = await request.json();
    const parsed = InterviewRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return jsonBadRequest(rid, 'Invalid request: ' + parsed.error.message);
    }
    
    const { question, answer, question_type } = parsed.data;
    
    console.log('[LangChain Interview API] Processing question, type:', question_type, 'has answer:', !!answer);
    
    // Invoke LangChain interview preparation chain
    const chain = getInterviewPreparationChain();
    const result = await chain.invoke({
      question,
      answer,
      questionType: question_type || 'behavioral',
    });
    
    console.log('[LangChain Interview API] Chain invocation successful');
    return jsonOk(rid, result);
    
  } catch (error) {
    console.error('[LangChain Interview API] Error:', error);
    
    const normalizedError = normalizeLangChainError(error);
    logError('Interview API error (LangChain)', { route, request_id: rid, error: String(error) });
    
    if (normalizedError instanceof LangChainConfigError) {
      return jsonUnauthorized(rid);
    }
    if (normalizedError instanceof LangChainQuotaError) {
      return jsonTooManyRequests(rid);
    }
    if (normalizedError instanceof LangChainTimeoutError) {
      return jsonServiceUnavailable(rid);
    }
    
    return jsonServerError(rid);
  }
}
