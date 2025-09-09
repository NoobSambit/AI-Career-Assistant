'use client';

import { EnhancedEmail } from '../../../lib/schemas/enhancedEmail';
import { GitBranch, Target, TrendingUp, Copy } from 'lucide-react';
import { useState } from 'react';

interface AlternativesViewProps {
  alternatives: EnhancedEmail['alternatives'];
}

export function AlternativesView({ alternatives }: AlternativesViewProps): JSX.Element {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (alternatives.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No A/B Test Alternatives Generated</h3>
        <p className="max-w-md mx-auto">
          Alternative versions would be created based on different approaches like varying tone, 
          structure, or persuasion techniques for optimal testing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
          🧪 A/B Testing Strategy
        </h4>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          Test these variations with different segments of your audience to optimize response rates. 
          Send each version to 25% of your list, then use the winner for the remaining 50%.
        </p>
      </div>

      <div className="grid gap-6">
        {alternatives.map((alternative, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <GitBranch className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {alternative.version}
                  </h4>
                </div>
                <button
                  onClick={() => handleCopy(`Subject: ${alternative.subject}\n\n${alternative.body}`, index)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedIndex === index ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Subject Line */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    Subject Line
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {alternative.subject}
                    </p>
                  </div>
                </div>

                {/* Email Body */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    Email Content
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                        {alternative.body}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Strategy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Strategy Rationale
                    </h5>
                    <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                      {alternative.rationale}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Expected Outcome
                    </h5>
                    <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                      {alternative.expectedOutcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* A/B Testing Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-3">
          📊 A/B Testing Best Practices
        </h4>
        <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Test only one variable at a time (subject line, tone, CTA, etc.)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Ensure your sample size is large enough for statistical significance</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Run tests for at least 24-48 hours to account for different time zones</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Track not just open rates, but also click-through and conversion rates</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Document your results to build a knowledge base for future campaigns</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export type { AlternativesViewProps };
