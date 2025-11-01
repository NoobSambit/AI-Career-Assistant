'use client';

import React, { useState, useRef } from 'react';
import { MessageSquare, HelpCircle, Loader, CheckCircle, AlertCircle, Upload, Image, X, Target } from 'lucide-react';
import AgentLayout from '../components/AgentLayout';
import { EnhancedOutput } from '../components/interview/enhanced-output';
import { enhancedInterviewSchema, type EnhancedInterview } from '../../lib/schemas/enhancedInterview';
import { FileUploadZone } from '../components/shared/FileUploadZone';

const InterviewAgent = () => {
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [fileContextInput, setFileContextInput] = useState('');
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionText = questionInput.trim();
    const answerText = answerInput.trim();
    const contextText = fileContextInput.trim();
    const expectedSource: 'user' | 'assistant' = answerText ? 'user' : 'assistant';

    if (analysisMode === 'text' && !questionText) {
      setError('Please enter an interview question.');
      return;
    }

    if (analysisMode === 'file' && !selectedFile) {
      return;
    }

    setLoading(true);
    setError('');
    setEnhancedData(null);

    const buildFallback = (): EnhancedInterview => {
      if (expectedSource === 'user') {
        return {
          answerSource: 'user',
          assessment: {
            overallScore: 5,
            grade: 'Needs Improvement',
            summary: 'Provide more depth and structure so we can deliver a full STAR assessment.',
            strengths: ['Question identified', 'Initial attempt captured'],
            weaknesses: ['Needs clearer STAR structure', 'Missing measurable impact'],
          },
          starAnalysis: {
            situation: {
              strength: 5,
              feedback: 'Describe the scenario with timeline, stakeholders, and why it mattered.',
              examples: ['Mention team size and project scope', 'Call out customer or business impact'],
            },
            task: {
              strength: 5,
              feedback: 'Clarify your personal objective and what success looked like.',
              examples: ['State your responsibility', 'Explain success criteria from your manager'],
            },
            action: {
              strength: 5,
              feedback: 'List 2-3 key actions with tools, collaboration, and decisions.',
              examples: ['Highlight a leadership move', 'Reference any tooling or frameworks used'],
            },
            result: {
              strength: 4,
              feedback: 'Quantify the outcome and share recognition or lessons learned.',
              examples: ['Add metrics like % improvement or time saved', 'Mention feedback from stakeholders'],
            },
          },
          enhancedAnswer: {
            title: 'Enhanced Response Draft',
            content: answerText || 'Share your answer so we can enhance it with the STAR method.',
            keyPoints: [
              'Clarify the Situation with timeframe, team size, and stakes',
              'State your specific Task and success criteria',
              'Detail 2-3 Actions with tools, collaboration, and decisions',
              'Quantify the Result and include lessons learned',
            ],
            structure: [
              { section: 'Situation', content: 'Set the context clearly with stakeholders and timeline.' },
              { section: 'Task', content: 'Explain the objective you owned and what success meant.' },
              { section: 'Action', content: 'Describe key steps you took, highlighting leadership and tools.' },
              { section: 'Result', content: 'Share measurable impact and what you learned.' },
            ],
          },
          improvements: [
            {
              category: 'Structure',
              title: 'Reinforce STAR flow',
              description: 'Organize your answer explicitly into Situation, Task, Action, Result to make evaluation easier.',
              impact: 'High',
            },
          ],
          confidenceTips: [
            {
              title: 'Rehearse with structure cues',
              description: 'Practice each STAR section aloud to ensure timing and clarity.',
              actionSteps: [
                'Record a run-through and check that each STAR element is clear',
                'Add concrete metrics before your next rehearsal',
                'Time yourself to stay within 2 minutes',
              ],
            },
          ],
          followUpQuestions: [
            'Which metrics best demonstrate the impact of your actions?',
            'How did stakeholders respond to your approach?',
            'What would you adjust if you faced this scenario again?',
          ],
        };
      }

      return {
        answerSource: 'assistant',
        draftAnswer: {
          title: 'Suggested STAR Draft',
          content: `Question: ${questionText || 'Interview question not provided'}

Situation: Describe the most relevant context (team, challenge, timeframe).
Task: Clarify your objective and how success would be measured.
Action: Outline 2-3 decisive steps you would take, emphasizing collaboration and tools.
Result: Share the intended outcome, metrics, and lessons learned.`,
          keyPoints: [
            'Ground the draft in one authentic example from your experience.',
            'Quantify expected impact wherever possible.',
            'Call out leadership, collaboration, or innovation moments.',
          ],
          structure: [
            { section: 'Situation', content: 'Set the stage with timeline, stakeholders, and challenge.' },
            { section: 'Task', content: 'Explain what you were accountable for and define success.' },
            { section: 'Action', content: 'Highlight specific actions, tools, and decision-making.' },
            { section: 'Result', content: 'Share measurable outcomes and what you learned.' },
          ],
        },
        improvements: [
          {
            category: 'Personalization',
            title: 'Layer in your metrics',
            description: 'Add real numbers and stakeholder reactions to make the draft authentically yours.',
            impact: 'High',
          },
        ],
        confidenceTips: [
          {
            title: 'Practice the generated draft',
            description: 'Use the suggested answer as a rehearsal script and refine wording to match your voice.',
            actionSteps: [
              'Insert your real metrics and achievements into each section',
              'Rehearse until delivery feels natural and concise',
              'Prepare follow-up details for deeper probing',
            ],
          },
        ],
        followUpQuestions: [
          'What metrics will you add to personalize this draft?',
          'Which stakeholders were involved and how will you describe them?',
          'How will you adapt if the interviewer asks for an alternative outcome?',
        ],
      };
    };

    const ensureSource = (candidate: any, fallback: 'user' | 'assistant') => {
      if (candidate && typeof candidate === 'object' && !('answerSource' in candidate)) {
        return { ...candidate, answerSource: fallback };
      }
      return candidate;
    };

    const parseResult = (raw: string, obj: any, fallback: 'user' | 'assistant'): EnhancedInterview | null => {
      const prepared = ensureSource(obj, fallback);
      const direct = enhancedInterviewSchema.safeParse(prepared);
      if (direct.success) {
        return direct.data;
      }

      if (prepared?.enhancedData) {
        const nested = ensureSource(prepared.enhancedData, fallback);
        const nestedParse = enhancedInterviewSchema.safeParse(nested);
        if (nestedParse.success) {
          return nestedParse.data;
        }
      }

      if (raw) {
        const stripped = raw.replace(/```json|```/g, '').trim();
        const start = stripped.indexOf('{');
        const end = stripped.lastIndexOf('}');
        if (start >= 0 && end > start) {
          try {
            const parsed = JSON.parse(stripped.slice(start, end + 1));
            const candidate = enhancedInterviewSchema.safeParse(ensureSource(parsed, fallback));
            if (candidate.success) {
              return candidate.data;
            }
          } catch {}
        }

        try {
          const parsed = JSON.parse(stripped);
          const candidate = enhancedInterviewSchema.safeParse(ensureSource(parsed, fallback));
          if (candidate.success) {
            return candidate.data;
          }
        } catch {}
      }

      return null;
    };

    let result: any = null;

    try {
      if (analysisMode === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('prompt', contextText || 'Please analyze this document and provide interview coaching advice.');
        formData.append('role_context', roleContext);
        formData.append('context', JSON.stringify({ ...context, question: questionText || undefined, answer: answerText || undefined }));

        const response = await fetch('/api/interview', { method: 'POST', body: formData });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        result = await response.json();
      } else {
        const payload: Record<string, unknown> = {
          question: questionText,
          question_type: questionType,
          role_context: roleContext || undefined,
          context,
        };
        if (answerText) {
          payload.answer = answerText;
        }

        const response = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
      }

      const direct = parseResult('', result, expectedSource);
      if (direct) {
        setEnhancedData(direct);
        return;
      }

      if (result?.response && typeof result.response === 'string') {
        const parsed = parseResult(result.response, {}, expectedSource);
        if (parsed) {
          setEnhancedData(parsed);
          return;
        }
      }

      setEnhancedData(buildFallback());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEnhancedData(buildFallback());
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                <HelpCircle className="inline h-4 w-4 mr-2" />
                Interview question
              </label>
              <textarea
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={`Example questions:\n- Tell me about a time when you had to work with a difficult team member\n- Why should we hire you over other candidates?\n- How do you handle stress and pressure?`}
                rows={4}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200 text-gray-100 placeholder-gray-500 bg-gray-950"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Your answer (optional)
              </label>
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder={`Share your draft answer here for enhancement.\n\nExample:\nI led a cross-functional squad of 8 engineers to rebuild our payments stack...`}
                rows={6}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200 text-gray-100 placeholder-gray-500 bg-gray-950"
                disabled={loading}
              />
              <div className="mt-2 text-sm text-gray-400">
                💡 Include both question and answer to unlock scoring, STAR analysis, and targeted improvements.
              </div>
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
                  onClick={() => setQuestionInput(question)}
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
              value={fileContextInput}
              onChange={(e) => setFileContextInput(e.target.value)}
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
          disabled={
            loading ||
            (analysisMode === 'text' && !questionInput.trim()) ||
            (analysisMode === 'file' && !selectedFile)
          }
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

          {!loading && !enhancedData && (
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