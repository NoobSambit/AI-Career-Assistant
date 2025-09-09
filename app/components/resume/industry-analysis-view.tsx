'use client';

import { IndustryAnalysis } from '../../../lib/schemas/enhancedResume';
import { TrendingUp, Target, Award, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

interface IndustryAnalysisViewProps {
  analysis: IndustryAnalysis;
}

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-600 dark:text-green-400';
  if (score >= 6) return 'text-blue-600 dark:text-blue-400';
  if (score >= 4) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getProgressColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getMarketDemandColor = (demand: string) => {
  switch (demand) {
    case 'High': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800';
    case 'Low': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800';
  }
};

export function IndustryAnalysisView({ analysis }: IndustryAnalysisViewProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Industry Overview */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {analysis.industry} Industry Analysis
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.roleAlignment / 10)}`}>
              {analysis.roleAlignment}/100
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Role Alignment</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(analysis.roleAlignment)}`}
                style={{ width: `${analysis.roleAlignment}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.marketDemand / 10)}`}>
              {analysis.marketDemand}/100
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Market Demand</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(analysis.marketDemand)}`}
                style={{ width: `${analysis.marketDemand}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">
              {analysis.salaryInsights.range}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Salary Range</p>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Based on market data
            </div>
          </div>
        </div>

        {/* Industry Trends */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h5 className="font-semibold text-gray-900 dark:text-gray-100">Industry Trends</h5>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.industryTrends.map((trend, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
              >
                {trend}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Insights */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Salary Insights
        </h4>
        <div className="mb-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {analysis.salaryInsights.range}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Expected salary range for your role in the {analysis.industry} industry
          </p>
        </div>
        {analysis.salaryInsights.factors.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Factors affecting salary:</h5>
            <div className="flex flex-wrap gap-2">
              {analysis.salaryInsights.factors.map((factor, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Competitive Advantages */}
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Your Competitive Advantages
        </h4>
        <div className="space-y-3">
          {analysis.competitiveAdvantage.map((advantage, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-200 leading-relaxed">
                {advantage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Insights */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3">
          💡 {analysis.industry} Industry Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Key Trends</h5>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
              {analysis.industry === 'Technology' && (
                <>
                  <li>• AI/ML integration across all sectors</li>
                  <li>• Cloud-first development approaches</li>
                  <li>• Remote-first work culture adoption</li>
                  <li>• Emphasis on cybersecurity skills</li>
                </>
              )}
              {analysis.industry === 'Healthcare' && (
                <>
                  <li>• Digital health transformation</li>
                  <li>• Telemedicine expansion</li>
                  <li>• Data analytics in patient care</li>
                  <li>• Regulatory compliance focus</li>
                </>
              )}
              {analysis.industry === 'Finance' && (
                <>
                  <li>• Fintech disruption</li>
                  <li>• Blockchain and cryptocurrency</li>
                  <li>• Regulatory technology (RegTech)</li>
                  <li>• ESG investing focus</li>
                </>
              )}
              {!['Technology', 'Healthcare', 'Finance'].includes(analysis.industry) && (
                <>
                  <li>• Digital transformation initiatives</li>
                  <li>• Data-driven decision making</li>
                  <li>• Sustainability focus</li>
                  <li>• Automation and efficiency</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Growth Areas</h5>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
              {analysis.industry === 'Technology' && (
                <>
                  <li>• Full-stack development</li>
                  <li>• DevOps and cloud architecture</li>
                  <li>• Product management</li>
                  <li>• Data engineering</li>
                </>
              )}
              {analysis.industry === 'Healthcare' && (
                <>
                  <li>• Health informatics</li>
                  <li>• Clinical data analysis</li>
                  <li>• Healthcare administration</li>
                  <li>• Medical device development</li>
                </>
              )}
              {analysis.industry === 'Finance' && (
                <>
                  <li>• Quantitative analysis</li>
                  <li>• Risk management</li>
                  <li>• Financial technology</li>
                  <li>• Investment advisory</li>
                </>
              )}
              {!['Technology', 'Healthcare', 'Finance'].includes(analysis.industry) && (
                <>
                  <li>• Project management</li>
                  <li>• Business analysis</li>
                  <li>• Digital marketing</li>
                  <li>• Operations optimization</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { IndustryAnalysisViewProps };
