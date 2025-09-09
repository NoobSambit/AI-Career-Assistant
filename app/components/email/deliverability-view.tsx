'use client';

import { DeliverabilityAnalysis } from '../../../lib/schemas/enhancedEmail';
import { Shield, Smartphone, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DeliverabilityViewProps {
  analysis: DeliverabilityAnalysis;
}

const getSpamRiskColor = (risk: string) => {
  switch (risk) {
    case 'Low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800';
    case 'High': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800';
  }
};

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'Positive': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Negative': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Neutral': return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    default: return <div className="h-4 w-4 rounded-full bg-gray-400" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Positive': return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
    case 'Negative': return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
    case 'Neutral': return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800';
    default: return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800';
  }
};

export function DeliverabilityView({ analysis }: DeliverabilityViewProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Spam Risk Assessment */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Spam Risk Assessment
        </h4>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-lg border font-medium ${getSpamRiskColor(analysis.spamRisk)}`}>
              {analysis.spamRisk} Risk
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.spamRisk === 'Low' && 'Excellent deliverability expected'}
              {analysis.spamRisk === 'Medium' && 'Some spam filters may flag this email'}
              {analysis.spamRisk === 'High' && 'High chance of being marked as spam'}
            </div>
          </div>
        </div>

        {analysis.spamTriggers.length > 0 ? (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h5 className="font-medium text-red-800 dark:text-red-200 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Spam Triggers Detected
            </h5>
            <ul className="space-y-1">
              {analysis.spamTriggers.map((trigger, index) => (
                <li key={index} className="text-red-700 dark:text-red-300 text-sm flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              No spam triggers detected. Great job!
            </p>
          </div>
        )}
      </div>

      {/* Mobile Optimization */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2" />
          Mobile Optimization Score
        </h4>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {analysis.mobileOptimization}/10
            </span>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.mobileOptimization >= 8 && 'Excellent mobile experience'}
              {analysis.mobileOptimization >= 6 && analysis.mobileOptimization < 8 && 'Good mobile readability'}
              {analysis.mobileOptimization >= 4 && analysis.mobileOptimization < 6 && 'Needs mobile improvements'}
              {analysis.mobileOptimization < 4 && 'Poor mobile experience'}
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${analysis.mobileOptimization * 10}%` }}
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            📱 Over 50% of emails are opened on mobile devices. Mobile optimization is crucial for engagement.
          </p>
        </div>
      </div>

      {/* Engagement Factors */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Engagement Factors
        </h4>
        
        {analysis.engagementFactors.length > 0 ? (
          <div className="space-y-4">
            {analysis.engagementFactors.map((factor, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getImpactColor(factor.impact)}`}>
                <div className="flex items-start space-x-3">
                  {getImpactIcon(factor.impact)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{factor.factor}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(factor.impact)}`}>
                        {factor.impact}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{factor.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No specific engagement factors identified. Consider adding personalization, urgency, or social proof elements.</p>
          </div>
        )}
      </div>

      {/* Deliverability Tips */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3">
          📧 Deliverability Best Practices
        </h4>
        <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Use a recognizable sender name and email address</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Avoid excessive use of capital letters and exclamation marks</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Include a clear unsubscribe link in all marketing emails</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Test your emails across different clients and devices</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Maintain a good sender reputation by monitoring bounce rates</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export type { DeliverabilityViewProps };
