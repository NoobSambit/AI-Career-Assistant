'use client';

import { PsychologyAnalysis } from '../../../lib/schemas/enhancedEmail';
import { Brain, Heart, Target, TrendingUp, Zap, Eye } from 'lucide-react';

interface PsychologyAnalysisViewProps {
  analysis: PsychologyAnalysis;
}

const getEffectivenessColor = (effectiveness: string) => {
  switch (effectiveness) {
    case 'High': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800';
    case 'Low': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800';
  }
};

const getCognitiveLoadColor = (load: string) => {
  switch (load) {
    case 'Low': return 'text-green-600 dark:text-green-400';
    case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
    case 'High': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const getSentimentColor = (sentiment: number) => {
  if (sentiment > 0.3) return 'text-green-600 dark:text-green-400';
  if (sentiment > -0.3) return 'text-blue-600 dark:text-blue-400';
  return 'text-red-600 dark:text-red-400';
};

const getSentimentLabel = (sentiment: number) => {
  if (sentiment > 0.5) return 'Very Positive';
  if (sentiment > 0.1) return 'Positive';
  if (sentiment > -0.1) return 'Neutral';
  if (sentiment > -0.5) return 'Negative';
  return 'Very Negative';
};

export function PsychologyAnalysisView({ analysis }: PsychologyAnalysisViewProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Persuasion Techniques */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Persuasion Techniques Applied
        </h4>
        <div className="space-y-4">
          {analysis.persuasionTechniques.map((technique, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getEffectivenessColor(technique.effectiveness)}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold">{technique.technique}</h5>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffectivenessColor(technique.effectiveness)}`}>
                  {technique.effectiveness} Impact
                </span>
              </div>
              <p className="text-sm leading-relaxed">{technique.application}</p>
            </div>
          ))}
          {analysis.persuasionTechniques.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No specific persuasion techniques detected. Consider adding elements like social proof, urgency, or reciprocity.</p>
            </div>
          )}
        </div>
      </div>

      {/* Emotional Tone Analysis */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Emotional Tone Analysis
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Primary Tone</h5>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 font-medium text-lg">{analysis.emotionalTone.primary}</p>
            </div>
            
            {analysis.emotionalTone.secondary.length > 0 && (
              <>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3 mt-4">Secondary Tones</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.emotionalTone.secondary.map((tone, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {tone}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Sentiment Analysis</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Sentiment</span>
                <span className={`font-semibold ${getSentimentColor(analysis.emotionalTone.sentiment)}`}>
                  {getSentimentLabel(analysis.emotionalTone.sentiment)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    analysis.emotionalTone.sentiment > 0 ? 'bg-green-500' : 
                    analysis.emotionalTone.sentiment < 0 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${Math.abs(analysis.emotionalTone.sentiment) * 100}%`,
                    marginLeft: analysis.emotionalTone.sentiment < 0 ? `${(1 + analysis.emotionalTone.sentiment) * 100}%` : '0'
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cognitive & Action Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Cognitive Load
          </h4>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getCognitiveLoadColor(analysis.cognitiveLoad)}`}>
              {analysis.cognitiveLoad}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.cognitiveLoad === 'Low' && 'Easy to read and understand quickly'}
              {analysis.cognitiveLoad === 'Medium' && 'Requires moderate attention to process'}
              {analysis.cognitiveLoad === 'High' && 'Demands significant mental effort to comprehend'}
            </p>
          </div>
          
          <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              💡 Lower cognitive load typically leads to better engagement and response rates
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Action Clarity
          </h4>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.actionClarity}
              </span>
              <span className="text-lg text-gray-500 dark:text-gray-400">/10</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysis.actionClarity * 10}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.actionClarity >= 8 && 'Crystal clear what action to take'}
              {analysis.actionClarity >= 6 && analysis.actionClarity < 8 && 'Reasonably clear call-to-action'}
              {analysis.actionClarity >= 4 && analysis.actionClarity < 6 && 'Somewhat unclear what to do next'}
              {analysis.actionClarity < 4 && 'Very unclear or missing call-to-action'}
            </p>
          </div>
          
          <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              🎯 Clear calls-to-action can increase response rates by up to 371%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { PsychologyAnalysisViewProps };
