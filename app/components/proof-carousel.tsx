'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, MessageSquare, Mail } from 'lucide-react';

const ProofCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'resume' | 'interview' | 'email'>('resume');

  const allExamples = {
    resume: [
      {
        title: 'Software Engineer Resume',
        before: {
          score: 34,
          issues: ['Generic job descriptions', 'Missing keywords', 'Poor formatting']
        },
        after: {
          score: 87,
          improvements: ['Quantified achievements', 'ATS-optimized keywords', 'Clean layout']
        },
        delta: '+53 points'
      },
      {
        title: 'Marketing Manager Resume',
        before: {
          score: 42,
          issues: ['Vague responsibilities', 'No metrics', 'Outdated format']
        },
        after: {
          score: 91,
          improvements: ['ROI-focused bullets', 'Industry keywords', 'Modern design']
        },
        delta: '+49 points'
      },
      {
        title: 'Data Analyst Resume',
        before: {
          score: 28,
          issues: ['Technical jargon heavy', 'No business impact', 'Dense blocks']
        },
        after: {
          score: 84,
          improvements: ['Business-focused language', 'Impact metrics', 'Scannable format']
        },
        delta: '+56 points'
      }
    ],
    interview: [
      {
        title: 'Behavioral Question Response',
        before: {
          score: 'Unfocused',
          issues: ['Rambling answers', 'No clear structure', 'Missing key details']
        },
        after: {
          score: 'STAR Method',
          improvements: ['Situation clearly set', 'Task defined', 'Action & Result specific']
        },
        delta: 'Confidence +'
      },
      {
        title: 'Technical Interview Prep',
        before: {
          score: 'Scattered',
          issues: ['Incomplete explanations', 'No examples', 'Weak conclusions']
        },
        after: {
          score: 'Structured',
          improvements: ['Step-by-step approach', 'Real examples', 'Clear reasoning']
        },
        delta: 'Clarity +'
      }
    ],
    email: [
      {
        title: 'Cold Outreach Email',
        before: {
          score: 'Too long',
          issues: ['Wordy introduction', 'Unclear ask', 'Generic content']
        },
        after: {
          score: 'Concise',
          improvements: ['Direct opening', 'Specific request', 'Personal touch']
        },
        delta: 'Replies +'
      },
      {
        title: 'Follow-up Message',
        before: {
          score: 'Pushy',
          issues: ['Too aggressive', 'No value add', 'Poor timing']
        },
        after: {
          score: 'Professional',
          improvements: ['Respectful tone', 'Added context', 'Clear next steps']
        },
        delta: 'Response +'
      }
    ]
  };

  const examples = allExamples[activeFilter];
  const currentExample = examples[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const handleFilterChange = (filter: 'resume' | 'interview' | 'email') => {
    setActiveFilter(filter);
    setCurrentIndex(0);
  };

  const filters = [
    { key: 'resume', label: 'Resume', icon: null },
    { key: 'interview', label: 'Interview', icon: MessageSquare },
    { key: 'email', label: 'Email', icon: Mail }
  ];

  const getScoreDisplay = (score: number | string, isAfter: boolean = false) => {
    if (typeof score === 'number') {
      return `${score}/100`;
    }
    return score;
  };

  const getScoreColor = (isAfter: boolean) => {
    return isAfter 
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Real results from real searches
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          See how JobGoblin improves job search materials with measurable results
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key as 'resume' | 'interview' | 'email')}
                className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {/* Main Carousel Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentExample.title}
              </h3>
              <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                {currentExample.delta}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Before</h4>
                  <div className={`text-3xl font-bold ${getScoreColor(false)}`}>
                    {getScoreDisplay(currentExample.before.score)}
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <h5 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Issues found:</h5>
                  <ul className="space-y-1">
                    {currentExample.before.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start">
                        <span className="text-red-500 mr-2 mt-0.5">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* After */}
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">After</h4>
                  <div className={`text-3xl font-bold ${getScoreColor(true)}`}>
                    {getScoreDisplay(currentExample.after.score, true)}
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h5 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Improvements made:</h5>
                  <ul className="space-y-1">
                    {currentExample.after.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start">
                        <span className="text-green-500 mr-2 mt-0.5">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label="Previous example"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label="Next example"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 dark:bg-blue-400' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to example ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofCarousel;