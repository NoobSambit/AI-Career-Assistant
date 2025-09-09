'use client';

import { StarAnalysis } from '../../../lib/schemas/enhancedInterview';
import { TrendingUp, CheckCircle, AlertCircle, Target } from 'lucide-react';

interface StarAnalysisViewProps {
  analysis: StarAnalysis;
}

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-600 dark:text-green-400';
  if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getScoreIcon = (score: number) => {
  if (score >= 8) return CheckCircle;
  if (score >= 6) return AlertCircle;
  return AlertCircle;
};

const getProgressColor = (score: number) => {
  if (score >= 8) return 'bg-green-500';
  if (score >= 6) return 'bg-yellow-500';
  return 'bg-red-500';
};

export function StarAnalysisView({ analysis }: StarAnalysisViewProps): JSX.Element {
  const components = [
    { key: 'situation', label: 'Situation', data: analysis.situation },
    { key: 'task', label: 'Task', data: analysis.task },
    { key: 'action', label: 'Action', data: analysis.action },
    { key: 'result', label: 'Result', data: analysis.result },
  ];

  const averageScore = Math.round(
    (analysis.situation.strength + analysis.task.strength + analysis.action.strength + analysis.result.strength) / 4
  );

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Overall STAR Score
          </h4>
          <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}/10
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(averageScore)}`}
            style={{ width: `${averageScore * 10}%` }}
          />
        </div>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {averageScore >= 8 && "Excellent structure! Your answer follows the STAR method very well."}
          {averageScore >= 6 && averageScore < 8 && "Good structure with room for improvement in specific areas."}
          {averageScore < 6 && "Your answer could benefit from better STAR structure and more specific details."}
        </div>
      </div>

      {/* Individual Components */}
      <div className="grid gap-6">
        {components.map(({ key, label, data }) => {
          const Icon = getScoreIcon(data.strength);
          
          return (
            <div key={key} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    data.strength >= 8 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : data.strength >= 6 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Icon className={`h-5 w-5 ${getScoreColor(data.strength)}`} />
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {label}
                    </h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm font-medium ${getScoreColor(data.strength)}`}>
                        {data.strength}/10
                      </span>
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(data.strength)}`}
                          style={{ width: `${data.strength * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {data.feedback}
              </p>
              
              {data.examples && data.examples.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Suggestions for improvement:
                  </p>
                  <ul className="space-y-1">
                    {data.examples.map((example, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1 flex-shrink-0 text-xs">•</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {example}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { StarAnalysisViewProps };
