import { NextRequest } from 'next/server';
import { getResumeEnhancementChain } from '@/lib/langchain/chains/resumeChain';
import { LangChainConfigError, LangChainQuotaError, LangChainTimeoutError, normalizeLangChainError } from '@/lib/langchain/client';
import { ResumeTextSchema, validateUploadedFile, truncate } from '@/lib/validation';
import { jsonOk, jsonBadRequest, jsonTooLarge, jsonUnsupported, jsonTooManyRequests, jsonServerError, jsonUnauthorized, jsonServiceUnavailable } from '@/lib/errors';
import { requestId, logError } from '@/lib/log';
import { checkRateLimit } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/security';
import { parseDocument } from '@/lib/documentParser';

export const runtime = 'nodejs';

/**
 * LangChain-powered resume enhancement endpoint
 * 
 * Simplified flow:
 * 1. Validate request and check rate limits
 * 2. Extract text from file or use direct input
 * 3. Invoke resume enhancement chain
 * 4. Return validated, structured response
 */
export async function POST(request: NextRequest) {
  const rid = requestId();
  const route = '/api/resume';
  const ip = getClientIp(request);
  
  const rl = checkRateLimit(ip, route);
  if (!rl.allowed) {
    return jsonTooManyRequests(rid);
  }
  
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File || formData.get('image') as File;
      const contextStr = (formData.get('context') as string) || '{}';
      const context = JSON.parse(contextStr);

      const fileCheck = validateUploadedFile(file || null);
      if (!fileCheck.ok) {
        if (fileCheck.reason === 'missing') return jsonBadRequest(rid, 'File is required');
        if (fileCheck.reason === 'too_large') return jsonTooLarge(rid);
        return jsonUnsupported(rid);
      }

      // Parse document
      const parseResult = await parseDocument(file);
      
      if (parseResult.method === 'error') {
        return jsonBadRequest(rid, `Document parsing failed: ${parseResult.error}`);
      }

      const extractedText = truncate(parseResult.text, 12000);
      
      console.log('[LangChain Resume API] Processing file upload, content length:', extractedText.length);
      
      // Invoke LangChain resume enhancement chain
      const chain = getResumeEnhancementChain();
      const result = await chain.invoke({
        content: extractedText,
        context: context && Object.keys(context).length > 0 ? {
          role: context.role,
          industry: context.industry,
          companySize: context.company_size,
          experienceLevel: context.experience_level,
          keywords: context.keywords,
        } : undefined,
      });
      
      console.log('[LangChain Resume API] Chain invocation successful');
      return jsonOk(rid, result);
      
    } else {
      // Handle text input
      const body = await request.json();
      const parsed = ResumeTextSchema.safeParse(body);
      if (!parsed.success) {
        return jsonBadRequest(rid);
      }
      
      const { user_input, context = {} } = parsed.data as any;
      
      console.log('[LangChain Resume API] Processing text input, length:', user_input.length);
      
      // Invoke LangChain resume enhancement chain
      const chain = getResumeEnhancementChain();
      const result = await chain.invoke({
        content: user_input,
        context: context && Object.keys(context).length > 0 ? {
          role: context.role,
          industry: context.industry,
          companySize: context.company_size,
          experienceLevel: context.experience_level,
          keywords: context.keywords,
        } : undefined,
      });
      
      console.log('[LangChain Resume API] Chain invocation successful');
      return jsonOk(rid, result);
    }
  } catch (error) {
    console.error('[LangChain Resume API] Error:', error);
    
    const normalizedError = normalizeLangChainError(error);
    logError('Resume API error (LangChain)', { route, request_id: rid, error: String(error) });
    
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
