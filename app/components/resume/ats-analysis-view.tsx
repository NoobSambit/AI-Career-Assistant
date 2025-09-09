'use client';

import { ATSAnalysis } from '../../../lib/schemas/enhancedResume';
import { BarChart3, Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface ATSAnalysisViewProps {
  analysis: ATSAnalysis;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getProgressColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export function ATSAnalysisView({ analysis }: ATSAnalysisViewProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Overall ATS Score */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          ATS Compatibility Score
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.score)}`}>
              {analysis.score}/100
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall ATS Score</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(analysis.score)}`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.keywordDensity)}`}>
              {analysis.keywordDensity}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keyword Density</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(analysis.keywordDensity)}`}
                style={{ width: `${analysis.keywordDensity}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.score)}`}>
              {analysis.grade}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">ATS Grade</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(analysis.score)}`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Missing Keywords
          </h4>
          <p className="text-red-700 dark:text-red-300 text-sm mb-3">
            These important keywords are missing from your resume and should be added to improve ATS compatibility:
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Keywords */}
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Recommended Keywords
        </h4>
        <p className="text-green-700 dark:text-green-300 text-sm mb-3">
          These keywords would strengthen your resume and improve ATS matching:
        </p>
        <div className="flex flex-wrap gap-2">
          {(analysis.recommendedKeywords || []).map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Section Optimization */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Section-by-Section Analysis
        </h4>
        <div className="space-y-4">
          {Object.entries(analysis.sectionOptimization).map(([sectionName, sectionData]) => (
            <div key={sectionName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{sectionName}</h5>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${getScoreColor(sectionData.score)}`}>
                    {sectionData.score}/100
                  </span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(sectionData.score)}`}
                      style={{ width: `${sectionData.score}%` }}
                    />
                  </div>
                </div>
              </div>
              <ul className="space-y-1">
                {sectionData.suggestions.map((suggestion, suggestionIndex) => (
                  <li key={suggestionIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                    <TrendingUp className="h-3 w-3 mt-1 flex-shrink-0 text-blue-500" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Tips */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3">
          🎯 ATS Optimization Tips
        </h4>
        <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Use standard section headings (Experience, Education, Skills)</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Include keywords from job descriptions naturally in your content</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Use both acronyms and full forms (e.g., "AI" and "Artificial Intelligence")</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Avoid images, tables, and complex formatting in ATS versions</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Save as .docx format for best ATS compatibility</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export type { ATSAnalysisViewProps };
