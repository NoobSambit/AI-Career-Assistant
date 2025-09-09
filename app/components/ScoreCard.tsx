import React from 'react';
import { TrendingUp, Award, AlertCircle, CheckCircle } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  grade?: string;
  improvements?: string[];
  analysis?: Record<string, any>;
  color?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  maxScore = 100, 
  grade, 
  improvements = [], 
  analysis = {},
  color = 'blue'
}) => {
  const percentage = Math.round((score / maxScore) * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeIcon = (grade: string) => {
    switch (grade?.toLowerCase()) {
      case 'excellent':
        return <Award className="h-5 w-5 text-green-500" />;
      case 'good':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'fair':
        return <TrendingUp className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-100">{title}</h4>
        {grade && (
          <div className="flex items-center space-x-2">
            {getGradeIcon(grade)}
            <span className="text-sm font-medium text-gray-400">{grade}</span>
          </div>
        )}
      </div>

      {/* Score Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Overall Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(percentage)} dark:text-inherit`}>
            {score}/{maxScore}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              percentage >= 80 ? 'bg-green-500' : 
              percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-sm text-gray-400">{percentage}%</span>
        </div>
      </div>

      {/* Analysis Breakdown */}
      {Object.keys(analysis).length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Breakdown:</h5>
          <div className="space-y-2">
            {Object.entries(analysis).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-medium text-gray-200">
                  {typeof value === 'number' ? `${value}/25` : value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-300 mb-2">Recommendations:</h5>
          <ul className="space-y-1">
            {improvements.slice(0, 3).map((improvement, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
          {improvements.length > 3 && (
            <p className="text-xs text-gray-500 mt-2">
              +{improvements.length - 3} more recommendations
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreCard;