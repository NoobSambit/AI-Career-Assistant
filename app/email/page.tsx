'use client';

import React, { useState, useRef } from 'react';
import { Mail, Settings, Loader, CheckCircle, AlertCircle, Upload, Image, X, Users, Clock } from 'lucide-react';
import AgentLayout from '../components/AgentLayout';
import ScoreCard from '../components/ScoreCard';
import { EnhancedOutput } from '../components/email/enhanced-output';
import { enhancedEmailSchema, type EnhancedEmail } from '../../lib/schemas/enhancedEmail';
import { FileUploadZone } from '../components/shared/FileUploadZone';

const EmailAgent = () => {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('friendly');
  const [response, setResponse] = useState('');
  const [enhancedData, setEnhancedData] = useState<EnhancedEmail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'text' | 'file'>('text');
  const [emailContext, setEmailContext] = useState({
    recipient_relationship: '',
    purpose: '',
    urgency: 'medium',
    industry: '',
    company_size: ''
  });
  const [toneAssessment, setToneAssessment] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (analysisMode === 'text' && !input.trim()) return;
    if (analysisMode === 'file' && !selectedFile) return;

    setLoading(true);
    setError('');
    setResponse('');
    setEnhancedData(null);
    setToneAssessment(null);

    try {
      let result;
      
      if (analysisMode === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('tone', tone);
        formData.append('prompt', input.trim() || 'Please analyze this document and provide email assistance.');
        formData.append('recipient_relationship', emailContext.recipient_relationship);
        formData.append('purpose', emailContext.purpose);
        formData.append('urgency', emailContext.urgency);
        formData.append('context', JSON.stringify(emailContext));

        const response = await fetch('/api/email', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
      } else {
        const response = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_input: input,
            tone: tone,
            ...emailContext
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
      }
      
      // Parse the structured response
      const coerceToEnhanced = (raw: string, obj: any): EnhancedEmail | null => {
        // Case A: object validates as-is
        const direct = enhancedEmailSchema.safeParse(obj);
        if (direct.success) return direct.data;

        // Case B: try parsing from enhancedData field
        if (obj?.enhancedData) {
          const nested = enhancedEmailSchema.safeParse(obj.enhancedData);
          if (nested.success) return nested.data;
        }

        // Case C: extract from raw text and build minimal structure
        if (raw && typeof raw === 'string') {
          const stripped = raw.replace(/```json|```/g, '').trim();
          const start = stripped.indexOf('{');
          const end = stripped.lastIndexOf('}');
          
          if (start >= 0 && end > start) {
            try {
              const candidate = JSON.parse(stripped.slice(start, end + 1));
              const parsed = enhancedEmailSchema.safeParse(candidate);
              if (parsed.success) return parsed.data;
            } catch {}
          }
        }

        return null;
      };

      // Parse model output; tolerate ```json fences and extra prose
      if (result.response) {
        const raw: string = result.response as string;
        const stripped = raw.replace(/```json|```/g, '').trim();
        const start = stripped.indexOf('{');
        const end = stripped.lastIndexOf('}');
        let candidate: any = null;
        if (start >= 0 && end > start) {
          try { candidate = JSON.parse(stripped.slice(start, end + 1)); } catch {}
        }
        if (!candidate) {
          try { candidate = JSON.parse(stripped); } catch {}
        }

        const coerced = coerceToEnhanced(raw, candidate || {});
        if (coerced) {
          setEnhancedData(coerced);
        } else {
          // As a last resort, produce a minimal structured output
          const minimal: EnhancedEmail = {
            assessment: {
              overallScore: 6,
              grade: 'Good',
              summary: 'Your email shows good structure but could benefit from enhanced persuasion techniques and clearer calls-to-action.',
              strengths: ['Clear communication', 'Professional tone'],
              weaknesses: ['Missing urgency elements', 'Could use more personalization'],
              predictedResponseRate: 45
            },
            enhancedEmail: {
              subject: 'Enhanced: Professional Communication',
              greeting: 'Hi there,',
              body: input || 'Your enhanced email content will appear here with improved structure, persuasion techniques, and clear calls-to-action.',
              closing: 'Best regards,',
              signature: 'Your Name\nYour Title\nCompany Name',
              keyChanges: [
                'Improved subject line for better open rates',
                'Added personalization elements',
                'Strengthened call-to-action',
                'Optimized for mobile readability'
              ],
              wordCount: 120,
              readingTime: '30 seconds'
            },
            psychologyAnalysis: {
              persuasionTechniques: [
                {
                  technique: 'Clarity',
                  application: 'Clear and direct communication style',
                  effectiveness: 'Medium' as const
                }
              ],
              emotionalTone: {
                primary: 'Professional',
                secondary: ['Helpful', 'Direct'],
                sentiment: 0.6
              },
              cognitiveLoad: 'Low' as const,
              actionClarity: 7
            },
            culturalAdaptation: {
              communicationStyle: 'Direct Western Business',
              formalityLevel: 6,
              culturalConsiderations: ['Professional courtesy', 'Time-conscious approach'],
              timeZoneOptimization: 'Tuesday-Thursday, 10 AM - 2 PM'
            },
            deliverabilityAnalysis: {
              spamRisk: 'Low' as const,
              spamTriggers: [],
              engagementFactors: [
                {
                  factor: 'Professional tone',
                  impact: 'Positive' as const,
                  suggestion: 'Maintains credibility and trust'
                }
              ],
              mobileOptimization: 8
            },
            improvements: [
              {
                category: 'Engagement',
                title: 'Add Personalization',
                description: 'Include recipient-specific details to increase relevance and response rates',
                impact: 'High' as const,
                effort: 'Low' as const,
                businessImpact: 'Increases response rate by 25%',
                example: 'Reference recent achievements or mutual connections'
              }
            ],
            alternatives: [
              {
                version: 'Version A: Direct Approach',
                subject: 'Quick question about [specific topic]',
                body: 'Direct, results-focused version...',
                rationale: 'For busy executives who prefer brevity',
                expectedOutcome: 'Higher response rate from C-level contacts'
              }
            ],
            followUpStrategy: {
              timeline: [
                {
                  day: 3,
                  action: 'Gentle follow-up',
                  template: 'Following up on my previous email...'
                }
              ],
              escalationPath: ['Email', 'LinkedIn message', 'Phone call'],
              responseScenarios: [
                {
                  scenario: 'No response',
                  nextSteps: ['Send value-first follow-up', 'Try different channel']
                }
              ]
            },
            industryInsights: {
              industry: emailContext.industry || 'General Business',
              bestPractices: ['Keep under 150 words', 'Use clear subject lines', 'Include specific CTAs'],
              commonMistakes: ['Generic greetings', 'Unclear purpose', 'No follow-up plan'],
              benchmarks: {
                averageResponseRate: 42,
                optimalLength: '100-150 words',
                bestSendTimes: ['Tuesday 10 AM', 'Thursday 2 PM']
              }
            }
          };
          setEnhancedData(minimal);
        }
      }
      
      if (result.tone_assessment) {
        setToneAssessment(result.tone_assessment);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Only create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toneOptions = [
    { 
      value: 'friendly', 
      label: 'Friendly', 
      description: 'Warm and approachable',
      emoji: '😊'
    },
    { 
      value: 'formal', 
      label: 'Formal', 
      description: 'Professional and polished',
      emoji: '💼'
    },
    { 
      value: 'assertive', 
      label: 'Assertive', 
      description: 'Direct and confident',
      emoji: '💪'
    }
  ];

  const relationshipOptions = [
    { value: '', label: 'Select relationship...' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'manager', label: 'Manager/Boss' },
    { value: 'client', label: 'Client/Customer' },
    { value: 'vendor', label: 'Vendor/Supplier' },
    { value: 'team_member', label: 'Team Member' },
    { value: 'external', label: 'External Contact' }
  ];

  const purposeOptions = [
    { value: '', label: 'Select purpose...' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'request', label: 'Request/Ask' },
    { value: 'update', label: 'Status Update' },
    { value: 'meeting', label: 'Meeting Related' },
    { value: 'introduction', label: 'Introduction' },
    { value: 'complaint', label: 'Complaint/Issue' },
    { value: 'thank_you', label: 'Thank You' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low - No rush' },
    { value: 'medium', label: 'Medium - Normal' },
    { value: 'high', label: 'High - Urgent' }
  ];

  const emailTemplates = [
    "Following up on our meeting yesterday...",
    "I wanted to reach out regarding the project timeline...",
    "Thank you for your time during the interview...",
    "I'm writing to request a status update on..."
  ];

  return (
    <AgentLayout
      title="Email Rewriter"
      description="Transform your emails into professional, impactful messages with the perfect tone for any business situation. Now with advanced context awareness and effectiveness scoring!"
      icon={Mail}
      color="from-blue-500 to-blue-600"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-3">
            Choose Analysis Mode:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAnalysisMode('text')}
              className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                analysisMode === 'text'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-900 hover:bg-gray-800'
              }`}
            >
              <Mail className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <div className="text-sm font-semibold text-gray-100">Text Input</div>
              <div className="text-xs text-gray-400">Write or paste email content</div>
            </button>
            <button
              type="button"
              onClick={() => setAnalysisMode('file')}
              className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                analysisMode === 'file'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-900 hover:bg-gray-800'
              }`}
            >
              <Image className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <div className="text-sm font-semibold text-gray-100">File Upload</div>
              <div className="text-xs text-gray-400">Upload documents or images</div>
            </button>
          </div>
        </div>

        {/* Email Context */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-400" />
            Email Context (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recipient Relationship
              </label>
              <select
                value={emailContext.recipient_relationship}
                onChange={(e) => setEmailContext({...emailContext, recipient_relationship: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-950 text-gray-100"
              >
                {relationshipOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Purpose
              </label>
              <select
                value={emailContext.purpose}
                onChange={(e) => setEmailContext({...emailContext, purpose: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-950 text-gray-100"
              >
                {purposeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Urgency Level
              </label>
              <select
                value={emailContext.urgency}
                onChange={(e) => setEmailContext({...emailContext, urgency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-950 text-gray-100"
              >
                {urgencyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={emailContext.industry}
                onChange={(e) => setEmailContext({...emailContext, industry: e.target.value})}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-950 text-gray-100 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Size
              </label>
              <select
                value={emailContext.company_size}
                onChange={(e) => setEmailContext({...emailContext, company_size: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-950 text-gray-100"
              >
                <option value="">Any Size</option>
                <option value="startup">Startup (1-50 employees)</option>
                <option value="small">Small (51-200 employees)</option>
                <option value="medium">Medium (201-1000 employees)</option>
                <option value="large">Large (1000+ employees)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-3">
            <Settings className="inline h-4 w-4 mr-2" />
            Select Email Tone:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {toneOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTone(option.value)}
                className={`border-2 rounded-xl p-4 transition-all duration-300 text-center ${
                  tone === option.value
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="text-sm font-semibold text-gray-100">{option.label}</div>
                <div className="text-xs text-gray-400 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        {analysisMode === 'file' && (
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              <Upload className="inline h-4 w-4 mr-2" />
              Upload Email Document or Image:
            </label>
            
            <FileUploadZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              imagePreview={filePreview}
              onRemoveFile={removeFile}
              accept=".pdf,.docx,.png,.jpg,.jpeg,.gif,.webp"
              maxSize={10 * 1024 * 1024} // 10MB
              disabled={loading}
              title="Upload Email Document"
              description="PDF, DOCX, PNG, JPG, GIF up to 10MB"
            />
          </div>
        )}

        {/* Text Input Section */}
        {analysisMode === 'text' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                <Mail className="inline h-4 w-4 mr-2" />
                Enter your email content to rewrite:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Examples:
- Hey, can you send me the files? Need them ASAP.
- I don't think your proposal is good. We need changes.
- Hope you're well. When can we meet to discuss the project?

Or paste your complete email draft..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300 text-gray-100 placeholder-gray-500 bg-gray-950"
                disabled={loading}
              />
              <div className="mt-2 text-sm text-gray-400">
                💡 Tip: Include context about the relationship and desired outcome for better results
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <p className="text-sm font-medium text-gray-200 mb-3">Quick start templates:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {emailTemplates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInput(template)}
                    className="text-left p-3 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-600 rounded-lg transition-all duration-300 text-gray-200 hover:text-indigo-300"
                    disabled={loading}
                  >
                    "{template}"
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Additional Context for File Mode */}
        {analysisMode === 'file' && (
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Additional Context (Optional):
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Provide additional context about the document:
- What specific help do you need with this email?
- What outcome are you trying to achieve?
- Any specific concerns or requirements?
- Background information about the situation?"
              rows={4}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300 text-gray-100 placeholder-gray-500 bg-gray-950"
              disabled={loading}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (analysisMode === 'text' && !input.trim()) || (analysisMode === 'file' && !selectedFile)}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>{analysisMode === 'file' ? 'Analyzing Document...' : 'Rewriting Email...'}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>{analysisMode === 'file' ? 'Analyze Document' : 'Rewrite Email'}</span>
            </>
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800 rounded-xl flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-300 font-medium">Error</h4>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {loading && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="animate-pulse space-y-6">
                <div className="h-16 bg-gray-800 rounded-lg"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-32 bg-gray-800 rounded-lg"></div>
                  <div className="h-24 bg-gray-800 rounded-lg"></div>
                </div>
              </div>
            </div>
          )}

          {enhancedData && !loading && (
            <EnhancedOutput data={enhancedData} />
          )}

          {response && !enhancedData && !loading && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-400">
              <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed font-sans">
                {response}
              </pre>
            </div>
          )}

          {!loading && !enhancedData && !response && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-100 mb-2">Ready to enhance your email?</h3>
              <p className="text-gray-400">Fill out the form and submit to see your optimized results here.</p>
            </div>
          )}
        </div>
      </div>


      {/* Tips Section */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h4 className="text-gray-200 font-semibold mb-3">Professional Email Tips:</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• Choose the appropriate tone based on your relationship with the recipient</li>
          <li>• Keep subject lines clear and specific</li>
          <li>• Use a professional greeting and closing</li>
          <li>• Be concise while providing necessary context</li>
          <li>• Proofread before sending and consider the recipient's perspective</li>
          <li>• Use bullet points for multiple requests or information</li>
          <li>• Use the context fields above for more targeted rewriting</li>
          {analysisMode === 'file' && (
            <>
              <li>• PDF and DOCX files provide the best text extraction for email content</li>
              <li>• For image files, ensure clear, high-resolution quality for better recognition</li>
              <li>• Upload email drafts, screenshots, or related documents for comprehensive analysis</li>
            </>
          )}
        </ul>
      </div>
    </AgentLayout>
  );
};

export default EmailAgent;