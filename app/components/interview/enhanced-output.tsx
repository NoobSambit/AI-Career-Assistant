'use client';

import { useState } from 'react';
import { EnhancedInterview } from '../../../lib/schemas/enhancedInterview';
import { ResultsSummary } from './results-summary';
import { OutputTabs, OutputTab } from './output-tabs';
import { StarAnalysisView } from './star-analysis-view';
import { MessageSquare, TrendingUp, Lightbulb, Target, Users, HelpCircle } from 'lucide-react';

interface EnhancedOutputProps {
  data: EnhancedInterview;
}

export function EnhancedOutput({ data }: EnhancedOutputProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<OutputTab>('enhanced');

  const handleCopy = async () => {
    let content = '';
    
    switch (activeTab) {
      case 'enhanced':
        if (data.answerSource === 'user' && data.enhancedAnswer) {
          content = `${data.enhancedAnswer.title}\n\n${data.enhancedAnswer.content}`;
        } else if (data.answerSource === 'assistant' && 'draftAnswer' in data) {
          content = `${data.draftAnswer.title}\n\n${data.draftAnswer.content}`;
        }
        break;
      case 'star':
        if (data.answerSource === 'user' && data.starAnalysis) {
          content = `STAR Analysis:\nSituation: ${data.starAnalysis.situation.strength}/10 - ${data.starAnalysis.situation.feedback}\nTask: ${data.starAnalysis.task.strength}/10 - ${data.starAnalysis.task.feedback}\nAction: ${data.starAnalysis.action.strength}/10 - ${data.starAnalysis.action.feedback}\nResult: ${data.starAnalysis.result.strength}/10 - ${data.starAnalysis.result.feedback}`;
        } else {
          content = 'STAR analysis is available when a user answer is provided.';
        }
        break;
      case 'improvements':
        content = data.improvements.map(imp => `${imp.title}: ${imp.description}`).join('\n');
        break;
      case 'tips':
        content = data.confidenceTips.map((tip, i) => `${i + 1}. ${tip.title}: ${tip.description}\nAction Steps:\n${tip.actionSteps.map(step => `- ${step}`).join('\n')}`).join('\n\n');
        break;
    }
    
    await navigator.clipboard.writeText(content);
  };

  const handleExport = (type: 'pdf' | 'md') => {
    // TODO: Implement export functionality
    console.log(`Export ${type} requested`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'enhanced':
        if (data.answerSource === 'assistant' && 'draftAnswer' in data) {
          return (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  {data.draftAnswer.title}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                      {data.draftAnswer.content}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Key Takeaways to Personalize
                </h4>
                <div className="grid gap-3">
                  {data.draftAnswer.keyPoints.map((point, index) => (
                    <div key={index} className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                          {point}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Draft Structure Guidance
                </h4>
                <div className="space-y-3">
                  {data.draftAnswer.structure.map((section, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {section.section}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                {data.enhancedAnswer.title}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                    {data.enhancedAnswer.content}
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Key Improvements Made
              </h4>
              <div className="grid gap-3">
                {data.enhancedAnswer.keyPoints.map((point, index) => (
                  <div key={index} className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Answer Structure
              </h4>
              <div className="space-y-3">
                {data.enhancedAnswer.structure.map((section, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {section.section}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'star':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              STAR Method Analysis
            </h3>
            {data.answerSource === 'user' && data.starAnalysis ? (
              <StarAnalysisView analysis={data.starAnalysis} />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Provide both question and answer to unlock STAR scoring and structured feedback.
                </p>
              </div>
            )}
          </div>
        );

      case 'improvements':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Specific Improvements
            </h3>
            <div className="space-y-4">
              {data.improvements.map((improvement, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        improvement.impact === 'High' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : improvement.impact === 'Medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      }`}>
                        {improvement.impact} Impact
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {improvement.category}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {improvement.title}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    {improvement.description}
                  </p>
                  {improvement.example && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Example:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{improvement.example}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Confidence Building Tips
            </h3>
            <div className="space-y-6">
              {data.confidenceTips.map((tip, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    {tip.title}
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
                    {tip.description}
                  </p>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Action Steps:</p>
                    <ul className="space-y-2">
                      {tip.actionSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-3">
                          <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                          <span className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Follow-up Questions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Be Ready for These Follow-up Questions
              </h4>
              <div className="space-y-2">
                {data.followUpQuestions.map((question, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {question}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden">
      <ResultsSummary
        assessment={'assessment' in data ? data.assessment : undefined}
        answerSource={data.answerSource}
        onCopy={handleCopy}
        onExport={handleExport}
      />
      
      <OutputTabs value={activeTab} onChange={setActiveTab} />
      
      <div className="p-6 lg:p-8">
        {renderTabContent()}
      </div>
      
      {/* Trust message */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          🎯 Practice this response out loud and adapt it to your specific experiences
        </p>
      </div>
    </div>
  );
}

export type { EnhancedOutputProps };
