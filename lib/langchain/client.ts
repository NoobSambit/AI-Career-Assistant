import { ChatGroq } from '@langchain/groq';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

/**
 * Custom errors for LangChain integration
 */
export class LangChainConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LangChainConfigError';
  }
}

export class LangChainTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LangChainTimeoutError';
  }
}

export class LangChainQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LangChainQuotaError';
  }
}

/**
 * LangChain client configuration
 */
export interface LangChainConfig {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
}

/**
 * Default configuration for LangChain models
 */
const DEFAULT_CONFIG: Required<LangChainConfig> = {
  modelName: 'llama-3.3-70b-versatile', // Groq's latest model - 30 RPM free tier!
  temperature: 0.7,
  maxTokens: 8192,
  maxRetries: 3,
};

/**
 * Singleton client instance cache
 */
let _clientCache: Map<string, BaseChatModel> = new Map();

/**
 * Get or create a configured LangChain model instance
 * 
 * @param config - Optional configuration overrides
 * @returns Configured ChatGroq instance
 * @throws LangChainConfigError if API key is missing
 */
export function getLangChainModel(config: LangChainConfig = {}): BaseChatModel {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new LangChainConfigError('GROQ_API_KEY environment variable is not set');
  }

  // Merge with defaults
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Create cache key from config
  const cacheKey = JSON.stringify(finalConfig);
  
  // Return cached instance if available
  if (_clientCache.has(cacheKey)) {
    return _clientCache.get(cacheKey)!;
  }

  // Create new Groq model instance
  const model = new ChatGroq({
    apiKey,
    model: finalConfig.modelName, // Groq uses 'model' instead of 'modelName'
    temperature: finalConfig.temperature,
    maxTokens: finalConfig.maxTokens,
    maxRetries: finalConfig.maxRetries,
  });

  // Cache the instance
  _clientCache.set(cacheKey, model);
  
  return model;
}

/**
 * Get a model optimized for structured output (lower temperature)
 */
export function getStructuredOutputModel(): BaseChatModel {
  return getLangChainModel({
    temperature: 0.1, // Low temperature for consistent structured output
    maxTokens: 8192,
  });
}

/**
 * Get a model optimized for creative tasks (higher temperature)
 */
export function getCreativeModel(): BaseChatModel {
  return getLangChainModel({
    temperature: 0.9,
    maxTokens: 8192,
  });
}

/**
 * Clear the client cache (useful for testing or config updates)
 */
export function clearClientCache(): void {
  _clientCache.clear();
}

/**
 * Normalize LangChain errors to application-specific errors
 */
export function normalizeLangChainError(error: any): Error {
  const msg = typeof error?.message === 'string' ? error.message : String(error);
  
  // Check for quota/rate limit errors
  if (msg.includes('quota') || msg.includes('429') || msg.includes('QUOTA_EXCEEDED')) {
    return new LangChainQuotaError(msg);
  }
  
  // Check for timeout errors
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return new LangChainTimeoutError(msg);
  }
  
  // Check for API key errors
  if (msg.includes('API_KEY') || msg.includes('unauthorized') || msg.includes('401')) {
    return new LangChainConfigError(msg);
  }
  
  // Return original or wrapped error
  return error instanceof Error ? error : new Error(msg);
}