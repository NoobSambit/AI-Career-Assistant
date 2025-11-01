# LangChain Integration Setup Guide

## Overview

This document provides step-by-step instructions for setting up and deploying the LangChain-powered AI Career Assistant.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

The following packages have been added to `package.json`:
- `langchain` - Core LangChain library
- `@langchain/core` - LangChain core abstractions
- `@langchain/google-genai` - Google Gemini integration for LangChain
- `zod-to-json-schema` - Convert Zod schemas to JSON Schema for structured outputs

### 2. Environment Configuration

Ensure your `.env.local` file contains:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - for monitoring with LangSmith
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_PROJECT=ai-career-assistant
```

**Get API Keys:**
- Gemini API Key: https://makersuite.google.com/app/apikey
- LangSmith API Key: https://smith.langchain.com/ (optional, for monitoring)

### 3. Verify Installation

Run the development server:

```bash
npm run dev
```

Test the API endpoints:

```bash
# Test resume enhancement
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Software Engineer with 5 years experience in React and Node.js"}'

# Test email enhancement
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Please send me the report", "tone": "formal"}'

# Test interview preparation
curl -X POST http://localhost:3000/api/interview \
  -H "Content-Type: application/json" \
  -d '{"question": "Tell me about a time you faced a challenge", "answer": "I worked on a difficult project..."}'
```

## Architecture

### Directory Structure

```
lib/langchain/
├── client.ts                 # Model configuration & error handling
├── prompts/                  # Reusable prompt templates
│   ├── resume.ts
│   ├── email.ts
│   └── interview.ts
├── parsers/                  # Structured output parsers
│   ├── resumeParser.ts
│   ├── emailParser.ts
│   └── interviewParser.ts
├── chains/                   # Processing chains
│   ├── resumeChain.ts
│   ├── emailChain.ts
│   └── interviewChain.ts
├── tools/                    # LangChain tool wrappers
│   └── index.ts
└── evaluation/              # Testing & monitoring
    └── (to be added)
```

### Key Components

#### 1. Client (`lib/langchain/client.ts`)

Centralized model configuration with:
- Singleton pattern with configuration caching
- Automatic retry logic (max 2 retries)
- Timeout management (30s default)
- Error normalization

**Usage:**
```typescript
import { getStructuredOutputModel } from '@/lib/langchain/client';

const model = getStructuredOutputModel(); // Low temp for JSON
```

#### 2. Prompt Templates

Convert manual string concatenation to parameterized templates:

**Before:**
```typescript
const prompt = RESUME_PROMPTS.base + contextInfo;
```

**After:**
```typescript
const prompt = await resumeEnhancementPrompt.format({
  resumeContent: content,
});
```

#### 3. Structured Output Parsers

Guarantee JSON schema compliance:

**Before:**
```typescript
const parsed = JSON.parse(cleanResponse);
// Hope it matches schema 🤞
```

**After:**
```typescript
const parsed = await parseResumeResponse(text);
// Validated against Zod schema ✅
```

#### 4. Chains

Composable processing pipelines:

```typescript
import { getResumeEnhancementChain } from '@/lib/langchain/chains/resumeChain';

const chain = getResumeEnhancementChain();
const result = await chain.invoke({
  content: userInput,
  context: { role: 'Software Engineer', industry: 'Technology' },
});
```

## Migration Strategy

### Phase 1: Parallel Deployment (Recommended)

Run old and new implementations side-by-side:

1. **Keep existing routes**: `app/api/resume/route.ts`
2. **Add new routes**: `app/api/resume/langchain-route.ts`
3. **Test thoroughly**: Compare outputs
4. **Switch over**: Rename files when confident

### Phase 2: Direct Migration

Replace existing implementation:

1. Backup current `app/api/*/route.ts` files
2. Replace with LangChain versions
3. Test all endpoints
4. Monitor for issues

## API Route Refactoring

### Before (Direct Gemini)

```typescript
// 50+ lines of manual parsing, error handling, prompt construction
const systemPrompt = RESUME_PROMPTS.base + contextInfo;
const response = await generateWithGemini(systemPrompt, userInput);
let cleanResponse = response.trim();
if (cleanResponse.startsWith('```json')) {
  cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
}
const parsed = JSON.parse(cleanResponse);
// Hope it works!
```

### After (LangChain)

```typescript
// 5 lines - clean, tested, type-safe
const chain = getResumeEnhancementChain();
const result = await chain.invoke({
  content: userInput,
  context: { role, industry },
});
return jsonOk(rid, result);
```

**Benefits:**
- 70% less code
- Type-safe outputs
- Automatic retry on failures
- Clear error messages
- Easier testing

## Monitoring with LangSmith

### Setup

1. Create account at https://smith.langchain.com/
2. Get API key from settings
3. Add to `.env.local`:

```bash
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_key_here
LANGCHAIN_PROJECT=ai-career-assistant
```

### What You Get

- **Prompt Tracking**: See every prompt sent to the model
- **Response Logging**: Capture all model responses
- **Latency Metrics**: P50, P95, P99 response times
- **Error Tracking**: Automatic error capture with context
- **Token Usage**: Cost tracking per request
- **A/B Testing**: Compare prompt versions

### Viewing Traces

1. Go to https://smith.langchain.com/
2. Select your project
3. View traces, filter by status, search by content
4. Click trace to see full execution flow

## Testing

### Unit Tests

Test individual components:

```typescript
import { getResumeEnhancementChain } from '@/lib/langchain/chains/resumeChain';
import { enhancedResumeSchema } from '@/lib/schemas/enhancedResume';

test('resume chain returns valid schema', async () => {
  const chain = getResumeEnhancementChain();
  const result = await chain.invoke({
    content: SAMPLE_RESUME,
  });
  
  expect(() => enhancedResumeSchema.parse(result)).not.toThrow();
  expect(result.assessment.strengths).toHaveLength(greaterThan(0));
});
```

### Integration Tests

Test API endpoints:

```bash
# Create test script
cat > test-api.sh << 'EOF'
#!/bin/bash

echo "Testing Resume API..."
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d @test-resume-sample.txt

echo "\nTesting Email API..."
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Dear Sir, please review", "tone": "formal"}'

echo "\nTesting Interview API..."
curl -X POST http://localhost:3000/api/interview \
  -H "Content-Type: application/json" \
  -d '{"question": "Describe a challenge", "answer": "I faced..."}'
EOF

chmod +x test-api.sh
./test-api.sh
```

## Deployment

### Vercel Deployment

1. **Install dependencies** on Vercel:
   - Vercel automatically installs from `package.json`
   - No action needed

2. **Set environment variables**:
   ```
   GEMINI_API_KEY=your_key
   LANGCHAIN_TRACING_V2=true (optional)
   LANGCHAIN_API_KEY=your_langsmith_key (optional)
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Function Configuration

Ensure timeout is sufficient for LLM calls:

```json
// vercel.json
{
  "functions": {
    "app/api/**/route.ts": {
      "maxDuration": 30
    }
  }
}
```

## Troubleshooting

### Issue: "GEMINI_API_KEY is not set"

**Solution**: Ensure `.env.local` has the key and restart dev server:
```bash
echo "GEMINI_API_KEY=your_key_here" >> .env.local
npm run dev
```

### Issue: "Module not found: langchain"

**Solution**: Install dependencies:
```bash
npm install
```

### Issue: "Schema validation failed"

**Solution**: 
1. Check LangSmith trace to see malformed output
2. Adjust prompt if needed
3. The parser automatically retries 2 times

### Issue: "Timeout after 30s"

**Solution**:
1. Increase timeout in chain config
2. Simplify prompt
3. Check LangSmith for slow requests

### Issue: "Rate limit exceeded"

**Solution**:
1. Check Gemini API quotas
2. Adjust rate limits in `lib/rateLimit.ts`
3. Consider caching common requests

## Performance Optimization

### Caching

Model instances are cached by configuration:

```typescript
// These share the same cached instance
const model1 = getStructuredOutputModel();
const model2 = getStructuredOutputModel();

// This creates a new instance
const model3 = getLangChainModel({ temperature: 0.5 });
```

### Prompt Optimization

- Keep prompts concise (< 2000 tokens)
- Use clear JSON schema instructions
- Test different temperatures (0.1 = consistent, 0.9 = creative)

### Latency Reduction

- Enable streaming for long responses (future enhancement)
- Use prompt caching (Gemini feature)
- Optimize document parsing

## Future Enhancements

### 1. Retrieval-Augmented Generation (RAG)

Add vector store for context injection:

```typescript
import { FaissStore } from '@langchain/community/vectorstores/faiss';

const vectorStore = await FaissStore.fromTexts(
  jobDescriptions,
  metadatas,
  embeddings
);

const retriever = vectorStore.asRetriever({ k: 3 });
```

### 2. Memory for Multi-Turn Conversations

```typescript
import { BufferMemory } from 'langchain/memory';

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: 'chat_history',
});
```

### 3. Agent Architecture

Let AI decide which tools to use:

```typescript
import { initializeAgentExecutorWithOptions } from 'langchain/agents';

const agent = await initializeAgentExecutorWithOptions(
  allTools,
  model,
  { agentType: 'structured-chat-zero-shot-react-description' }
);
```

## Support

**Issues**: https://github.com/NoobSambit/AI-Career-Assistant/issues
**LangChain Docs**: https://js.langchain.com/
**LangSmith**: https://smith.langchain.com/

---

**Last Updated**: 2025-01-01
**Version**: 1.0.0
