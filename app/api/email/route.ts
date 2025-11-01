import { NextRequest } from 'next/server';
import { getEmailEnhancementChain } from '@/lib/langchain/chains/emailChain';
import { LangChainConfigError, LangChainQuotaError, LangChainTimeoutError, normalizeLangChainError } from '@/lib/langchain/client';
import { jsonOk, jsonBadRequest, jsonTooManyRequests, jsonServerError, jsonUnauthorized, jsonServiceUnavailable } from '@/lib/errors';
import { requestId, logError } from '@/lib/log';
import { checkRateLimit } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/security';
import { z } from 'zod';

export const runtime = 'nodejs';

const EmailRequestSchema = z.object({
  user_input: z.string().min(1).max(5000),
  tone: z.enum(['friendly', 'formal', 'assertive']).optional(),
});

/**
 * LangChain-powered email enhancement endpoint
 */
export async function POST(request: NextRequest) {
  const rid = requestId();
  const route = '/api/email';
  const ip = getClientIp(request);
  
  const rl = checkRateLimit(ip, route);
  if (!rl.allowed) {
    return jsonTooManyRequests(rid);
  }
  
  try {
    const body = await request.json();
    const parsed = EmailRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return jsonBadRequest(rid, 'Invalid request: ' + parsed.error.message);
    }
    
    const { user_input, tone } = parsed.data;
    
    console.log('[LangChain Email API] Processing email, length:', user_input.length, 'tone:', tone);
    
    // Invoke LangChain email enhancement chain
    const chain = getEmailEnhancementChain();
    const result = await chain.invoke({
      content: user_input,
      tone: tone || 'friendly',
    });
    
    console.log('[LangChain Email API] Chain invocation successful');
    return jsonOk(rid, result);
    
  } catch (error) {
    console.error('[LangChain Email API] Error:', error);
    
    const normalizedError = normalizeLangChainError(error);
    logError('Email API error (LangChain)', { route, request_id: rid, error: String(error) });
    
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
