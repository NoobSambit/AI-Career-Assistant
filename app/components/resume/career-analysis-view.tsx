'use client';

import { EnhancedResume } from '../../../lib/schemas/enhancedResume';
import { TrendingUp, Target, Clock, BookOpen, ArrowRight, Star, CheckCircle } from 'lucide-react';

interface CareerAnalysisViewProps {
  analysis: EnhancedResume['careerAnalysis'];
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Entry Level': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
    case 'Mid': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    case 'Senior': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800';
    case 'Lead': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800';
    default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800';
  }
};

export function CareerAnalysisView({ analysis }: CareerAnalysisViewProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Current Level */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Career Level Assessment
        </h4>
        
        <div className={`border rounded-lg p-4 mb-4 ${getLevelColor(analysis.currentLevel)}`}>
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6" />
            <div>
              <h5 className="font-semibold text-lg">Current Level: {analysis.currentLevel}</h5>
              <p className="text-sm mt-1">
                Ready for career advancement opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Progression Path */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Career Progression Path
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-600 dark:text-blue-400">
                {analysis.progressionPath.nextRole}
                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">Next Target</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <Clock className="h-4 w-4 inline mr-1" />
                Timeframe: {analysis.progressionPath.timeframe}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Requirements for next role:</h5>
            <ul className="space-y-1">
              {analysis.progressionPath.requirements.map((requirement, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Skill Gaps to Address
        </h4>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
          Focus on developing these skills to accelerate your career progression:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.skillGaps.map((skillGap, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-yellow-950/10 rounded-lg">
              <Target className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">{skillGap.skill}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    skillGap.importance === 'high' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : skillGap.importance === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  }`}>
                    {skillGap.importance} priority
                  </span>
                  <span className="text-xs text-yellow-700 dark:text-yellow-300">
                    {skillGap.timeToAcquire}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
          <ArrowRight className="h-5 w-5 mr-2" />
          Recommended Next Steps
        </h4>
        <div className="space-y-4">
          {analysis.nextSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-green-950/10 rounded-lg">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-green-800 dark:text-green-200 font-medium leading-relaxed">
                  {step}
                </p>
                <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                  {step.includes('project') && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      💻 Hands-on experience
                    </span>
                  )}
                  {step.includes('certification') && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      🏆 Professional credential
                    </span>
                  )}
                  {step.includes('open-source') && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      🌟 Community involvement
                    </span>
                  )}
                  {step.includes('knowledge') && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      📚 Theoretical foundation
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Development Tips */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3">
          🚀 Career Development Strategy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Short-term (3-6 months)</h5>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
              <li>• Update LinkedIn profile with new skills</li>
              <li>• Complete relevant online certifications</li>
              <li>• Start a portfolio project</li>
              <li>• Network within your industry</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Long-term (6-12 months)</h5>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
              <li>• Seek leadership opportunities</li>
              <li>• Contribute to open-source projects</li>
              <li>• Mentor junior colleagues</li>
              <li>• Consider advanced certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { CareerAnalysisViewProps };
