'use client';

import { useState } from 'react';
import { Copy, Download, CheckCircle, TrendingUp, Mail, Zap } from 'lucide-react';
import { EnhancedEmail } from '../../../lib/schemas/enhancedEmail';

interface ResultsSummaryProps {
  assessment: EnhancedEmail['assessment'];
  onCopy: () => Promise<void>;
  onExport: (type: 'pdf' | 'md') => void;
}

export function ResultsSummary({ assessment, onCopy, onExport }: ResultsSummaryProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Excellent': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      case 'Good': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30';
      case 'Needs Improvement': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30';
      case 'Poor': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600 dark:text-green-400';
    if (rate >= 50) return 'text-blue-600 dark:text-blue-400';
    if (rate >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side - Assessment */}
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-100">
                  Email Communication Analysis
                </h3>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-400">
                      {assessment.overallScore}/10
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(assessment.grade)}`}>
                      {assessment.grade}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className={`text-lg font-semibold ${getResponseRateColor(assessment.predictedResponseRate)}`}>
                      {assessment.predictedResponseRate}%
                    </span>
                    <span className="text-sm text-gray-300">predicted response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Email Quality</span>
                <span className="text-sm text-gray-300">{assessment.overallScore * 10}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(assessment.overallScore)}`}
                  style={{ width: `${assessment.overallScore * 10}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Response Likelihood</span>
                <span className="text-sm text-gray-300">{assessment.predictedResponseRate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(assessment.predictedResponseRate / 10)}`}
                  style={{ width: `${assessment.predictedResponseRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-gray-300 leading-relaxed mb-4">
            {assessment.summary}
          </p>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {assessment.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                    <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Areas to Improve
              </h4>
              <ul className="space-y-1">
                {assessment.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                    <span className="text-yellow-400 mt-1 flex-shrink-0">•</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex flex-col space-y-3 lg:ml-6">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Email
              </>
            )}
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onExport('pdf')}
              className="flex items-center justify-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => onExport('md')}
              className="flex items-center justify-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              MD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ResultsSummaryProps };
