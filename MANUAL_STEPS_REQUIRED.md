# Manual Steps Required - LangChain Integration

## ⚠️ IMPORTANT: These steps must be completed by the engineering team

This document outlines all manual actions required to complete the LangChain integration and deploy to production.

---

## 🔧 Step 1: Install Dependencies (CRITICAL)

The TypeScript errors you're seeing are expected because dependencies haven't been installed yet.

```bash
cd /home/hairyfairy/Documents/AI-Career-Assistant

# Install all dependencies including new LangChain packages
npm install

# This will install:
# - langchain
# - @langchain/core
# - @langchain/google-genai
# - zod-to-json-schema
```

**Expected Output:**
```
added 47 packages, and audited 485 packages in 12s
```

**Verify Installation:**
```bash
npm list langchain
npm list @langchain/core
npm list @langchain/google-genai
```

---

## 🔑 Step 2: Configure Environment Variables

### Development Environment

Create or update `.env.local`:

```bash
# Required - Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional - For LangSmith monitoring
# Get from https://smith.langchain.com/
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_PROJECT=ai-career-assistant
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

### Production Environment (Vercel)

Add these environment variables in Vercel Dashboard:

1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add:
   - `GEMINI_API_KEY` = your key
   - `LANGCHAIN_TRACING_V2` = `true` (optional, for monitoring)
   - `LANGCHAIN_API_KEY` = your LangSmith key (optional)
   - `LANGCHAIN_PROJECT` = `ai-career-assistant` (optional)

---

## ✅ Step 3: Verify Installation

```bash
# Start development server
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.1s
```

**Check for TypeScript Errors:**
```bash
npm run build
```

All TypeScript errors should be resolved after `npm install`.

---

## 🧪 Step 4: Test API Endpoints

### Test Resume API

```bash
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Software Engineer with 5 years experience in React, Node.js, and Python. Led team of 3 developers. Improved application performance by 40%."
  }'
```

**Expected**: JSON response with `assessment`, `enhancedResume`, `atsAnalysis`, etc.

### Test Email API

```bash
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Hi Sarah, can you please send me the report when you get a chance? Thanks, John",
    "tone": "formal"
  }'
```

**Expected**: JSON response with `assessment`, `enhancedEmail`, `psychologyAnalysis`, etc.

### Test Interview API

```bash
curl -X POST http://localhost:3000/api/interview \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Tell me about a time you faced a challenge",
    "answer": "I worked on a project with tight deadlines. I organized daily standups and delegated tasks effectively. We delivered on time.",
    "question_type": "behavioral"
  }'
```

**Expected**: JSON response with `assessment`, `enhancedAnswer`, `starAnalysis`, etc.

---

## 🔄 Step 5: Migration to LangChain Routes

### Option A: Parallel Deployment (Recommended)

Keep both implementations running:

**Current Status:**
```
app/api/resume/route.ts            ← Current (working)
app/api/resume/langchain-route.ts  ← NEW (ready to test)
```

**Test both and compare:**

```bash
# Test current implementation
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d @test-resume-sample.txt > output-current.json

# Temporarily test LangChain (manually rename file)
# mv app/api/resume/langchain-route.ts app/api/resume/route-langchain-temp.ts
# mv app/api/resume/route.ts app/api/resume/route-old.ts
# mv app/api/resume/route-langchain-temp.ts app/api/resume/route.ts

curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d @test-resume-sample.txt > output-langchain.json

# Compare outputs
diff <(jq -S . output-current.json) <(jq -S . output-langchain.json)
```

### Option B: Direct Migration

When ready to switch completely:

```bash
# Backup current implementations
mv app/api/resume/route.ts app/api/resume/route.ts.backup
mv app/api/email/route.ts app/api/email/route.ts.backup
mv app/api/interview/route.ts app/api/interview/route.ts.backup

# Activate LangChain routes
mv app/api/resume/langchain-route.ts app/api/resume/route.ts
mv app/api/email/langchain-route.ts app/api/email/route.ts
mv app/api/interview/langchain-route.ts app/api/interview/route.ts

# Test thoroughly
npm run dev
# Test all endpoints...

# If successful, commit
git add .
git commit -m "feat: migrate to LangChain-powered API routes"
```

---

## 📊 Step 6: Enable LangSmith Monitoring (Optional but Recommended)

### Sign Up for LangSmith

1. Visit https://smith.langchain.com/
2. Sign up with GitHub or email
3. Create a new project: "ai-career-assistant"
4. Get your API key from Settings

### Configure Tracing

Add to `.env.local`:

```bash
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt_your_key_here
LANGCHAIN_PROJECT=ai-career-assistant
```

### Verify Tracing

1. Make an API request (resume, email, or interview)
2. Go to https://smith.langchain.com/
3. Select "ai-career-assistant" project
4. You should see traces appearing in real-time

**What to look for:**
- Prompt sent to model
- Model response
- Parsing steps
- Total latency
- Any errors

---

## 🚀 Step 7: Deploy to Staging

### Deploy to Vercel Staging

```bash
# Build locally first
npm run build

# If successful, deploy
vercel

# Or deploy to production
vercel --prod
```

### Post-Deployment Checks

1. **Environment Variables**: Verify in Vercel dashboard
2. **Build Logs**: Check for any errors
3. **Function Logs**: Monitor for runtime errors
4. **Test Endpoints**: Use production URL

```bash
# Test production deployment
curl -X POST https://your-app.vercel.app/api/resume \
  -H "Content-Type: application/json" \
  -d '{"user_input": "test resume..."}'
```

---

## 📈 Step 8: Monitor and Validate

### First 24 Hours

**Metrics to Track:**
- [ ] Error rate (target: <1%)
- [ ] Response time P95 (target: <15s)
- [ ] Schema validation success (target: >99%)
- [ ] User feedback

**Where to Monitor:**
- Vercel Function Logs
- LangSmith Dashboard (if enabled)
- Application logs (console)

### Week 1

- [ ] Compare outputs with previous implementation
- [ ] Collect user feedback
- [ ] Review LangSmith traces for optimization opportunities
- [ ] Adjust prompts if needed

---

## 🧹 Step 9: Cleanup (After Stable)

Once LangChain implementation is stable (2-4 weeks):

```bash
# Remove backup files
rm app/api/resume/route.ts.backup
rm app/api/email/route.ts.backup
rm app/api/interview/route.ts.backup

# Optional: Deprecate old Gemini client (keep for now as fallback)
# Can remove lib/gemini.ts after 1 month of stable operation

# Commit cleanup
git add .
git commit -m "chore: remove deprecated API route backups"
```

---

## 📚 Step 10: Team Training

### Schedule Training Sessions

**Session 1: Overview (1 hour)**
- LangChain architecture walkthrough
- How chains work
- Prompt template system
- Q&A

**Session 2: Hands-On (2 hours)**
- Modify a prompt template
- Test changes locally
- Review LangSmith traces
- Deploy to staging

**Session 3: Advanced (1 hour)**
- Adding new chains
- Creating custom tools
- Debugging with LangSmith
- Best practices

### Training Materials

Share these documents:
- [LANGCHAIN_SETUP.md](LANGCHAIN_SETUP.md)
- [LANGCHAIN_MIGRATION.md](LANGCHAIN_MIGRATION.md)
- [LANGCHAIN_INTEGRATION_SUMMARY.md](LANGCHAIN_INTEGRATION_SUMMARY.md)
- LangChain JS Docs: https://js.langchain.com/

---

## 🔧 Step 11: Runtime Configuration (Vercel)

### Adjust Function Timeouts

If you see timeout errors, increase function timeout in `vercel.json`:

```json
{
  "functions": {
    "app/api/**/route.ts": {
      "maxDuration": 30
    }
  }
}
```

**Note**: Free tier limit is 10s, Pro tier allows up to 60s.

### Optimize for Serverless

LangChain works well with Next.js serverless, but consider:

- **Cold starts**: First request may be slower (~2-3s)
- **Memory**: Default 1024MB should be sufficient
- **Regions**: Deploy close to users

---

## ✅ Acceptance Criteria

Before marking migration as complete:

### Technical
- [ ] `npm install` completed successfully
- [ ] No TypeScript errors in build
- [ ] All API endpoints return valid schemas
- [ ] Response times within acceptable range (<15s P95)
- [ ] Error rate <1%

### Testing
- [ ] Resume API tested with text input ✓
- [ ] Resume API tested with file upload (PDF, DOCX) ✓
- [ ] Email API tested with all tones ✓
- [ ] Interview API tested with/without answers ✓
- [ ] Load tested (10-50 concurrent requests) ✓

### Deployment
- [ ] Deployed to staging
- [ ] Environment variables configured
- [ ] LangSmith tracing working (if enabled)
- [ ] Monitored for 24-48 hours
- [ ] Team approval obtained
- [ ] Deployed to production

### Documentation
- [ ] README updated
- [ ] Team trained
- [ ] Runbook created
- [ ] Monitoring dashboard set up

---

## 🆘 Troubleshooting Common Issues

### Issue: `npm install` fails

**Solution:**
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: TypeScript errors persist after install

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

### Issue: "GEMINI_API_KEY is not set"

**Solution:**
```bash
# Check if .env.local exists
cat .env.local

# Ensure it has the key
echo "GEMINI_API_KEY=your_key" >> .env.local

# Restart dev server
npm run dev
```

### Issue: API returns 500 error

**Solution:**
1. Check console logs for error details
2. Review LangSmith trace (if enabled)
3. Verify schema compliance
4. Test with sample data from `lib/langchain/evaluation/tests.ts`

### Issue: Slow response times

**Solution:**
1. Check LangSmith for bottlenecks
2. Review prompt length (keep <2000 tokens)
3. Consider prompt caching
4. Monitor Gemini API quotas

---

## 📞 Support Contacts

**Technical Issues:**
- Lead Engineer: NoobSambit
- Email: sambitpradhan.dev2004@gmail.com
- GitHub: https://github.com/NoobSambit/AI-Career-Assistant/issues

**LangChain/LangSmith:**
- Documentation: https://js.langchain.com/
- Community: https://github.com/langchain-ai/langchainjs/discussions

**Gemini API:**
- Console: https://makersuite.google.com/
- Docs: https://ai.google.dev/docs

---

## 📋 Quick Reference Checklist

Copy this checklist and track completion:

```markdown
## LangChain Integration Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Gemini API key obtained
- [ ] Repository cloned/updated

### Installation (Day 1)
- [ ] Run `npm install`
- [ ] Configure `.env.local` with GEMINI_API_KEY
- [ ] Verify no TypeScript errors: `npm run build`
- [ ] Start dev server: `npm run dev`

### Testing (Day 1-2)
- [ ] Test resume API (text input)
- [ ] Test resume API (file upload)
- [ ] Test email API (all tones)
- [ ] Test interview API
- [ ] Verify schema validation in logs

### Optional: LangSmith (Day 2)
- [ ] Sign up at smith.langchain.com
- [ ] Get API key
- [ ] Configure LANGCHAIN_TRACING_V2=true
- [ ] Verify traces appear in dashboard

### Migration (Week 1-2)
- [ ] Compare LangChain vs current outputs
- [ ] Load test (10-50 concurrent requests)
- [ ] Get team approval
- [ ] Rename langchain-route.ts to route.ts
- [ ] Backup old routes

### Deployment (Week 2-3)
- [ ] Deploy to staging
- [ ] Monitor for 24-48 hours
- [ ] Deploy to production
- [ ] Monitor error rates and latency

### Post-Deployment (Week 3-4)
- [ ] Team training completed
- [ ] Documentation reviewed
- [ ] Monitoring dashboard set up
- [ ] Cleanup backup files (after stable)

### Success Metrics
- [ ] Error rate <1%
- [ ] Response time P95 <15s
- [ ] Schema validation >99%
- [ ] Team satisfaction >8/10
```

---

**Status**: Ready for implementation  
**Priority**: High  
**Estimated Time**: 1-2 days for installation/testing, 2-4 weeks for full migration  
**Next Action**: Run `npm install`

---

**Last Updated**: 2025-01-01  
**Version**: 1.0.0
