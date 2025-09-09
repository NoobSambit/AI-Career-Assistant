'use client';

import { useState } from 'react';
import { EnhancedEmail } from '../../../lib/schemas/enhancedEmail';
import { ResultsSummary } from './results-summary';
import { OutputTabs, OutputTab } from './output-tabs';
import { PsychologyAnalysisView } from './psychology-analysis-view';
import { DeliverabilityView } from './deliverability-view';
import { AlternativesView } from './alternatives-view';
import { Mail, TrendingUp, Lightbulb, Target, Users, Globe, Zap, GitBranch, Clock, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';

interface EnhancedOutputProps {
  data: EnhancedEmail;
}

export function EnhancedOutput({ data }: EnhancedOutputProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<OutputTab>('enhanced');

  const handleCopy = async () => {
    let content = '';
    
    switch (activeTab) {
      case 'enhanced':
        content = `Subject: ${data.enhancedEmail.subject}\n\n${data.enhancedEmail.greeting}\n\n${data.enhancedEmail.body}\n\n${data.enhancedEmail.closing}\n${data.enhancedEmail.signature || ''}`;
        break;
      case 'psychology':
        content = `Psychology Analysis:\nPersuasion Techniques: ${data.psychologyAnalysis.persuasionTechniques.map(t => `${t.technique} (${t.effectiveness})`).join(', ')}\nEmotional Tone: ${data.psychologyAnalysis.emotionalTone.primary}\nSentiment: ${data.psychologyAnalysis.emotionalTone.sentiment}`;
        break;
      case 'improvements':
        content = data.improvements.map(imp => `${imp.title}: ${imp.description} (${imp.businessImpact})`).join('\n');
        break;
      case 'alternatives':
        content = data.alternatives.map(alt => `${alt.version}:\nSubject: ${alt.subject}\nRationale: ${alt.rationale}`).join('\n\n');
        break;
      case 'strategy':
        content = `Follow-up Strategy:\n${data.followUpStrategy.timeline.map(t => `Day ${t.day}: ${t.action}`).join('\n')}\n\nEscalation: ${data.followUpStrategy.escalationPath.join(' → ')}`;
        break;
      case 'insights':
        content = `Industry: ${data.industryInsights.industry}\nResponse Rate: ${data.industryInsights.benchmarks.averageResponseRate}%\nOptimal Length: ${data.industryInsights.benchmarks.optimalLength}\nBest Times: ${data.industryInsights.benchmarks.bestSendTimes.join(', ')}`;
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
        return (
          <div className="space-y-8">
            {/* Enhanced Email */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Enhanced Email
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject Line</label>
                  <div className="mt-1 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{data.enhancedEmail.subject}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Content</label>
                  <div className="mt-1 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-gray-900 dark:text-gray-100 mb-3">{data.enhancedEmail.greeting}</p>
                      <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed">
                        {data.enhancedEmail.body}
                      </div>
                      <p className="text-gray-900 dark:text-gray-100 mt-4 mb-1">{data.enhancedEmail.closing}</p>
                      {data.enhancedEmail.signature && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                          {data.enhancedEmail.signature}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>📊 {data.enhancedEmail.wordCount} words</span>
                  <span>⏱️ {data.enhancedEmail.readingTime} reading time</span>
                  <span>📱 Mobile optimized</span>
                </div>
              </div>
            </div>

            {/* Key Changes */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Key Improvements Made
              </h4>
              <div className="grid gap-3">
                {data.enhancedEmail.keyChanges.map((change, index) => (
                  <div key={index} className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                        {change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural Adaptation */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Cultural & Context Optimization
              </h4>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Communication Style</span>
                    <p className="text-gray-900 dark:text-gray-100">{data.culturalAdaptation.communicationStyle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Formality Level</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${data.culturalAdaptation.formalityLevel * 10}%` }}
                        />
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 text-sm">{data.culturalAdaptation.formalityLevel}/10</span>
                    </div>
                  </div>
                </div>
                {data.culturalAdaptation.timeZoneOptimization && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Optimal Send Time: </span>
                    <span className="text-gray-900 dark:text-gray-100">{data.culturalAdaptation.timeZoneOptimization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'psychology':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Psychology & Persuasion Analysis
            </h3>
            <PsychologyAnalysisView analysis={data.psychologyAnalysis} />
          </div>
        );

      case 'improvements':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Strategic Improvements
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        improvement.effort === 'Low'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : improvement.effort === 'Medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {improvement.effort} Effort
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
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      💰 Business Impact: {improvement.businessImpact}
                    </p>
                  </div>
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

      case 'alternatives':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <GitBranch className="h-5 w-5 mr-2" />
              A/B Testing Alternatives
            </h3>
            <AlternativesView alternatives={data.alternatives} />
          </div>
        );

      case 'deliverability':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Deliverability & Engagement
            </h3>
            <DeliverabilityView analysis={data.deliverabilityAnalysis} />
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Follow-up Strategy
            </h3>
            
            {/* Timeline */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">Follow-up Timeline</h4>
              <div className="space-y-4">
                {data.followUpStrategy.timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                      {item.day}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">{item.action}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.template}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Scenarios */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">Response Scenarios</h4>
              <div className="space-y-4">
                {data.followUpStrategy.responseScenarios.map((scenario, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{scenario.scenario}</p>
                    <ul className="mt-2 space-y-1">
                      {scenario.nextSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-gray-600 dark:text-gray-400 text-sm flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Escalation Path */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Escalation Path</h4>
              <div className="flex items-center space-x-2 overflow-x-auto">
                {data.followUpStrategy.escalationPath.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2 flex-shrink-0">
                    <div className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100">
                      {step}
                    </div>
                    {index < data.followUpStrategy.escalationPath.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Industry Insights & Benchmarks
            </h3>
            
            {/* Industry Overview */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {data.industryInsights.industry} Industry
              </h4>
              
              {/* Benchmarks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {data.industryInsights.benchmarks.averageResponseRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {data.industryInsights.benchmarks.optimalLength}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Optimal Length</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {data.industryInsights.benchmarks.bestSendTimes.join(', ')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Best Send Times</div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h4 className="text-md font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Best Practices
                </h4>
                <ul className="space-y-2">
                  {data.industryInsights.bestPractices.map((practice, index) => (
                    <li key={index} className="text-green-700 dark:text-green-300 text-sm flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h4 className="text-md font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Common Mistakes
                </h4>
                <ul className="space-y-2">
                  {data.industryInsights.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-red-700 dark:text-red-300 text-sm flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
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
        assessment={data.assessment}
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
          📧 Advanced email intelligence powered by behavioral psychology and industry data
        </p>
      </div>
    </div>
  );
}

export type { EnhancedOutputProps };
