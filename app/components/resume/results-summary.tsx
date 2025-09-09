'use client';

import { useState } from 'react';
import { Copy, Download, CheckCircle, TrendingUp, Briefcase, Target } from 'lucide-react';
import { EnhancedResume } from '../../../lib/schemas/enhancedResume';

interface ResultsSummaryProps {
  assessment: EnhancedResume['assessment'];
  onCopy: () => Promise<void>;
  onExport: (type: 'pdf' | 'md') => void;
}

export function ResultsSummary({ assessment, onCopy, onExport }: ResultsSummaryProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* ATS Improvement Display */}
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500 dark:text-red-400">{assessment.initialAtsScore || assessment.atsCompatibility}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Before</div>
          </div>
          
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              +{assessment.atsImprovement || (assessment.improvedAtsScore || assessment.overallScore) - (assessment.initialAtsScore || assessment.atsCompatibility)} points
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{assessment.improvedAtsScore || assessment.overallScore}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">After</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              Grade {assessment.grade}
            </div>
            <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleCopy}
            onKeyDown={(e) => handleKeyDown(e, handleCopy)}
            aria-label="Copy enhanced resume content"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => onExport('md')}
              onKeyDown={(e) => handleKeyDown(e, () => onExport('md'))}
              aria-label="Export as Markdown"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              <span>Export MD</span>
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => onExport('pdf')}
              onKeyDown={(e) => handleKeyDown(e, () => onExport('pdf'))}
              aria-label="Export as PDF"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ResultsSummaryProps };
