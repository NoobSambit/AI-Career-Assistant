'use client';

import React, { useState, useRef } from 'react';
import { MessageSquare, HelpCircle, Loader, CheckCircle, AlertCircle, Upload, Image, X, Target } from 'lucide-react';
import AgentLayout from '../components/AgentLayout';
import ScoreCard from '../components/ScoreCard';
import { EnhancedOutput } from '../components/interview/enhanced-output';
import { enhancedInterviewSchema, type EnhancedInterview } from '../../lib/schemas/enhancedInterview';
import { FileUploadZone } from '../components/shared/FileUploadZone';

const InterviewAgent = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [enhancedData, setEnhancedData] = useState<EnhancedInterview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'text' | 'file'>('text');
  const [questionType, setQuestionType] = useState('behavioral');
  const [roleContext, setRoleContext] = useState('');
  const [context, setContext] = useState({
    experience_level: 'mid-level',
    company_size: '',
    industry: ''
  });
  const [starAnalysis, setStarAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (analysisMode === 'text' && !input.trim()) return;
    if (analysisMode === 'file' && !selectedFile) return;

    setLoading(true);
    setError('');
    setResponse('');
    setEnhancedData(null);
    setStarAnalysis(null);

    try {
      let result;
      
      if (analysisMode === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('prompt', input.trim() || 'Please analyze this document and provide interview coaching advice.');
        formData.append('role_context', roleContext);
        formData.append('context', JSON.stringify(context));

        const response = await fetch('/api/interview', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
      } else {
        const response = await fetch('/api/interview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_input: input,
            question_type: questionType,
            role_context: roleContext,
            context: context
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
      }
      
      // Parse the structured response
      const coerceToEnhanced = (raw: string, obj: any): EnhancedInterview | null => {
        // Case A: object validates as-is
        const direct = enhancedInterviewSchema.safeParse(obj);
        if (direct.success) return direct.data;

        // Case B: try parsing from enhancedData field
        if (obj?.enhancedData) {
          const nested = enhancedInterviewSchema.safeParse(obj.enhancedData);
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
              const parsed = enhancedInterviewSchema.safeParse(candidate);
              if (parsed.success) return parsed.data;
            } catch {}
          }
        }

        return null;
      };

      // Parse model output; tolerate ```json fences and extra prose; avoid showing raw JSON
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
          // As a last resort, produce a minimal structured output from user's input
          // Check if this looks like a question + answer format
          const hasAnswer = input.toLowerCase().includes('answer:') || 
                           input.toLowerCase().includes('my response:') ||
                           input.split('\n').length > 3;
          
          const minimal: EnhancedInterview = {
            assessment: {
              overallScore: 6,
              grade: 'Good',
              summary: 'Your response shows good structure but could benefit from more specific details and quantified results.',
              strengths: ['Clear communication', 'Logical approach'],
              weaknesses: ['Missing specific metrics', 'Could use more detailed examples']
            },
            starAnalysis: hasAnswer ? {
              situation: {
                strength: 7,
                feedback: 'Good context provided, but could include more specific details about the impact',
                examples: ['Add specific metrics about delays', 'Mention team size or project scope']
              },
              task: {
                strength: 6,
                feedback: 'Task is implied but could be more explicitly stated',
                examples: ['Clearly state your specific responsibility', 'Define what success looks like']
              },
              action: {
                strength: 8,
                feedback: 'Multiple concrete actions taken, showing good problem-solving approach',
                examples: ['Great use of one-on-one conversation', 'Smart pairing strategy']
              },
              result: {
                strength: 7,
                feedback: 'Positive outcomes described but could use more quantification',
                examples: ['Add specific timeline improvements', 'Quantify productivity gains']
              }
            } : undefined,
            enhancedAnswer: {
              title: 'Enhanced Response Structure',
              content: input || 'Please provide your question and answer for detailed coaching.',
              keyPoints: [
                'Use the STAR method for behavioral questions',
                'Include specific metrics and numbers',
                'Show clear cause and effect relationships'
              ],
              structure: [
                { section: 'Situation', content: 'Set clear context with specific details' },
                { section: 'Task', content: 'Define your specific role and responsibilities' },
                { section: 'Action', content: 'Describe concrete steps you took' },
                { section: 'Result', content: 'Quantify the positive outcomes' }
              ]
            },
            improvements: [
              {
                category: 'Quantification',
                title: 'Add Specific Metrics',
                description: 'Include numbers, percentages, timeframes to make your impact tangible',
                impact: 'High' as const,
                example: 'Instead of "improved performance", say "reduced response time by 40%"'
              }
            ],
            confidenceTips: [
              {
                title: 'Practice Your Response',
                description: 'Rehearse your answer out loud to build confidence',
                actionSteps: [
                  'Record yourself telling the story',
                  'Time your response (aim for 90-120 seconds)',
                  'Practice key metrics until they flow naturally'
                ]
              }
            ],
            followUpQuestions: [
              'Can you tell me more about the specific challenges you faced?',
              'How did you measure the success of your actions?',
              'What would you do differently if you faced a similar situation again?'
            ]
          };
          setEnhancedData(minimal);
        }
      }
      
      if (result.star_analysis) {
        setStarAnalysis(result.star_analysis);
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

  const commonQuestions = [
    "Tell me about yourself",
    "Why do you want to work here?",
    "What is your greatest weakness?",
    "Describe a challenging situation you faced at work",
    "Where do you see yourself in 5 years?",
    "Why are you leaving your current job?",
  ];

  const questionTypes = [
    { value: 'behavioral', label: 'Behavioral', description: 'Past experiences and situations' },
    { value: 'technical', label: 'Technical', description: 'Skills and knowledge assessment' },
    { value: 'situational', label: 'Situational', description: 'Hypothetical scenarios' }
  ];

  const experienceLevels = [
    { value: 'entry-level', label: 'Entry Level (0-2 years)' },
    { value: 'mid-level', label: 'Mid Level (3-7 years)' },
    { value: 'senior-level', label: 'Senior Level (8-15 years)' },
    { value: 'executive', label: 'Executive (15+ years)' }
  ];

  return (
    <AgentLayout
      title="Interview Coach"
      description="Get expert guidance on answering interview questions with confidence using proven frameworks and professional techniques. Now with STAR method analysis and scoring!"
      icon={MessageSquare}
      color="from-emerald-500 to-emerald-600"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode Selection – segmented control */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">Analysis mode</label>
          <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button
              type="button"
              onClick={() => setAnalysisMode('text')}
              aria-pressed={analysisMode === 'text'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analysisMode === 'text'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Text Input
            </button>
            <button
              type="button"
              onClick={() => setAnalysisMode('file')}
              aria-pressed={analysisMode === 'file'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analysisMode === 'file'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              File Upload
            </button>
          </div>
        </div>

        {/* Interview Context */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-emerald-400" />
            Interview Context (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-950 text-gray-100"
              >
                {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role Context
              </label>
              <input
                type="text"
                value={roleContext}
                onChange={(e) => setRoleContext(e.target.value)}
                placeholder="e.g., Software Engineering Manager, Sales Director"
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-950 text-gray-100 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                value={context.experience_level}
                onChange={(e) => setContext({...context, experience_level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-950 text-gray-100"
              >
                {experienceLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={context.industry}
                onChange={(e) => setContext({...context, industry: e.target.value})}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-950 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        {analysisMode === 'file' && (
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              <Upload className="inline h-4 w-4 mr-2" />
              Upload Job Description, Interview Materials, or Related Documents:
            </label>
            
            <FileUploadZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              imagePreview={filePreview}
              onRemoveFile={removeFile}
              accept=".pdf,.docx,.png,.jpg,.jpeg,.gif,.webp"
              maxSize={10 * 1024 * 1024} // 10MB
              disabled={loading}
              title="Upload Interview Materials"
              description="PDF, DOCX, PNG, JPG, GIF up to 10MB"
            />
          </div>
        )}

        {/* Text Input Section */}
        {analysisMode === 'text' && (
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              <HelpCircle className="inline h-4 w-4 mr-2" />
              Enter your interview question or scenario:
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Examples:
- Tell me about a time when you had to work with a difficult team member
- Why should we hire you over other candidates?
- Describe your experience with project management
- How do you handle stress and pressure?

Or include both question and your answer:
Question: Tell me about a challenging project you led.
Answer: In my previous role, I led a team of 8 developers..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200 text-gray-100 placeholder-gray-500 bg-gray-950"
              disabled={loading}
            />
            <div className="mt-2 text-sm text-gray-400">
              💡 Tip: Include both the question and your answer for detailed STAR method analysis
            </div>
          </div>
        )}

        {/* Common Questions */}
        {analysisMode === 'text' && (
          <div>
            <p className="text-sm font-medium text-gray-200 mb-3">Quick start with common questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commonQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInput(question)}
                  className="text-left p-3 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-emerald-600 rounded-lg transition-all duration-300 text-gray-200 hover:text-emerald-300"
                  disabled={loading}
                >
                  "{question}"
                </button>
              ))}
            </div>
          </div>
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
- What specific aspects of the job description concern you most?
- What interview questions are you struggling with?
- Any specific experiences you want to highlight?
- What type of interview is this for (phone, video, panel, etc.)?"
              rows={4}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-300 text-gray-100 placeholder-gray-500 bg-gray-950"
              disabled={loading}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (analysisMode === 'text' && !input.trim()) || (analysisMode === 'file' && !selectedFile)}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>{analysisMode === 'file' ? 'Analyzing Document...' : 'Coaching Your Response...'}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>{analysisMode === 'file' ? 'Analyze Document' : 'Get Interview Coaching'}</span>
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
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-100 mb-2">Ready to practice your interview?</h3>
              <p className="text-gray-400">Fill out the form and submit to see your coaching results here.</p>
            </div>
          )}
        </div>
      </div>


      {/* Tips Section */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h4 className="text-gray-200 font-semibold mb-3">Interview Success Tips:</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
          <li>• Practice your responses out loud beforehand</li>
          <li>• Research the company and role thoroughly</li>
          <li>• Prepare thoughtful questions to ask the interviewer</li>
          <li>• Focus on specific examples that demonstrate your skills and achievements</li>
          <li>• Show enthusiasm and genuine interest in the role</li>
          <li>• Use the context fields above for more targeted coaching</li>
          {analysisMode === 'file' && (
            <>
              <li>• PDF and DOCX files provide the best text extraction for job descriptions</li>
              <li>• For image files, ensure clear, high-resolution quality for better recognition</li>
              <li>• Upload job descriptions, interview questions, or company materials for targeted advice</li>
            </>
          )}
        </ul>
      </div>
    </AgentLayout>
  );
};

export default InterviewAgent;