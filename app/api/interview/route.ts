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
  role_context: z.string().optional(),
  context: z.record(z.any()).optional(),
});

const FlexibleRequestSchema = z.object({
  user_input: z.string().min(1).max(5000),
  question_type: z.enum(['behavioral', 'technical', 'situational']).optional(),
  role_context: z.string().optional(),
  context: z.record(z.any()).optional(),
});

function extractQuestionAndAnswer(input: string): { question: string; answer?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { question: '' };
  }

  let question = '';
  let answer: string | undefined;

  const questionMatch = trimmed.match(/question\s*:\s*([\s\S]*?)(?:\nanswer\s*:|$)/i);
  if (questionMatch && questionMatch[1]) {
    question = questionMatch[1].trim();
  }

  const answerMatch = trimmed.match(/answer\s*:\s*([\s\S]+)/i);
  if (answerMatch && answerMatch[1]) {
    answer = answerMatch[1].trim();
  }

  if (!question) {
    const lines = trimmed.split(/\n+/);
    question = lines[0]?.trim() || '';
    const rest = lines.slice(1).join('\n').trim();
    if (rest) {
      answer = rest;
    }
  }

  if (answer) {
    answer = answer.trim();
    if (!answer) {
      answer = undefined;
    }
  }

  return { question, answer };
}

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
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      return jsonBadRequest(rid, 'File uploads are not supported for interview analysis yet. Please paste your question and answer as text.');
    }

    const body = await request.json();

    let question: string;
    let answer: string | undefined;
    let questionType: 'behavioral' | 'technical' | 'situational' | undefined;

    if ('user_input' in body) {
      const parsedFlexible = FlexibleRequestSchema.safeParse(body);
      if (!parsedFlexible.success) {
        return jsonBadRequest(rid, 'Invalid request: ' + parsedFlexible.error.message);
      }

      const { question: derivedQuestion, answer: derivedAnswer } = extractQuestionAndAnswer(parsedFlexible.data.user_input);
      questionType = parsedFlexible.data.question_type;

      if (!derivedQuestion) {
        return jsonBadRequest(rid, 'Invalid request: Unable to identify the interview question. Please provide a question.');
      }

      question = derivedQuestion;
      answer = derivedAnswer?.trim() || undefined;
    } else {
      const parsed = InterviewRequestSchema.safeParse(body);
      
      if (!parsed.success) {
        return jsonBadRequest(rid, 'Invalid request: ' + parsed.error.message);
      }
      
      question = parsed.data.question;
      answer = parsed.data.answer?.trim() || undefined;
      questionType = parsed.data.question_type;
    }
    
    console.log('[LangChain Interview API] Processing question, type:', questionType, 'has answer:', !!answer);
    
    // Invoke LangChain interview preparation chain
    const chain = getInterviewPreparationChain();
    const result = await chain.invoke({
      question,
      answer,
      questionType: questionType || 'behavioral',
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
