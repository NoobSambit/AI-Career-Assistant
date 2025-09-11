'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Upload, Star, MessageSquare, Mail, TrendingUp } from 'lucide-react';
import { BRAND_NAME, TAGLINE } from '@/lib/brand';

const Hero = () => {
  const [activePreview, setActivePreview] = useState<'resume' | 'interview' | 'email'>('resume');

  const previews = {
    resume: {
      label: 'Resume',
      before: {
        title: 'Before',
        score: '42/100',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        bars: [
          { width: 'w-3/4', color: 'bg-gray-200 dark:bg-gray-600' },
          { width: 'w-1/2', color: 'bg-gray-200 dark:bg-gray-600' },
          { width: 'w-2/3', color: 'bg-gray-200 dark:bg-gray-600' }
        ]
      },
      after: {
        title: 'After',
        score: '89/100',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        bars: [
          { width: 'w-full', color: 'bg-blue-200 dark:bg-blue-700' },
          { width: 'w-5/6', color: 'bg-blue-200 dark:bg-blue-700' },
          { width: 'w-4/5', color: 'bg-blue-200 dark:bg-blue-700' }
        ]
      },
      tag: 'ATS Score:'
    },
    interview: {
      label: 'Interview',
      before: {
        title: 'Before',
        score: 'Rambling',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        bars: [
          { width: 'w-full', color: 'bg-gray-200 dark:bg-gray-600' },
          { width: 'w-4/5', color: 'bg-gray-200 dark:bg-gray-600' },
          { width: 'w-3/4', color: 'bg-gray-200 dark:bg-gray-600' }
        ]
      },
      after: {
        title: 'After',
        score: 'STAR Method',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        bars: [
          { width: 'w-3/4', color: 'bg-indigo-200 dark:bg-indigo-700' },
          { width: 'w-4/5', color: 'bg-indigo-200 dark:bg-indigo-700' },
          { width: 'w-5/6', color: 'bg-indigo-200 dark:bg-indigo-700' }
        ]
      },
      tag: 'Answer Quality:'
    },
    email: {
      label: 'Email',
      before: {
        title: 'Before',
        score: 'Wordy',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        bars: [
          { width: 'w-full', color: 'bg-gray-200 dark:bg-gray-600' },
          { width: 'w-full', color: 'bg-gray-200 dark:bg-gray-600' },
          { width: 'w-4/5', color: 'bg-gray-200 dark:bg-gray-600' }
        ]
      },
      after: {
        title: 'After',
        score: 'Clear',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        bars: [
          { width: 'w-3/4', color: 'bg-teal-200 dark:bg-teal-700' },
          { width: 'w-2/3', color: 'bg-teal-200 dark:bg-teal-700' },
          { width: 'w-1/2', color: 'bg-teal-200 dark:bg-teal-700' }
        ]
      },
      tag: 'Clarity:'
    }
  };

  const currentPreview = previews[activePreview];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Copy */}
        <div className="space-y-8">
          {/* Proof Bar */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">1,241 users</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <span>3 job tools</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8/5</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {TAGLINE}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
              Resume Booster, Interview Coach, and Email Rewriter that make your applications clear and confident.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Resume Booster</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">Interview Coach</span>
              <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">Email Rewriter</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/resume"
              className="inline-flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Open Resume Booster"
            >
              <Upload className="h-5 w-5 mr-2" />
              Resume
            </Link>
            <Link
              href="/interview"
              className="inline-flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Open Interview Coach"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Interview
            </Link>
            <Link
              href="/email"
              className="inline-flex items-center justify-center px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Open Email Rewriter"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email
            </Link>
          </div>

          {/* Trust Line */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We don't store your files. Delete anytime.
          </p>
        </div>

        {/* Right Column - Interactive Preview */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* Preview Switcher */}
              <div className="flex justify-center">
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                  {Object.entries(previews).map(([key, preview]) => (
                    <button
                      key={key}
                      onClick={() => setActivePreview(key as 'resume' | 'interview' | 'email')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                        activePreview === key
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {preview.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Before/After Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{currentPreview.before.title}</h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="space-y-2">
                      {currentPreview.before.bars.map((bar, index) => (
                        <div key={index} className={`h-${index === 0 ? '3' : '2'} ${bar.color} rounded ${bar.width}`}></div>
                      ))}
                    </div>
                    <div className={`mt-3 text-xs ${currentPreview.before.color} font-medium`}>
                      {currentPreview.tag} {currentPreview.before.score}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{currentPreview.after.title}</h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="space-y-2">
                      {currentPreview.after.bars.map((bar, index) => (
                        <div key={index} className={`h-${index === 0 ? '3' : '2'} ${bar.color} rounded ${bar.width}`}></div>
                      ))}
                    </div>
                    <div className={`mt-3 text-xs ${currentPreview.after.color} font-medium flex items-center`}>
                      {currentPreview.tag} {currentPreview.after.score}
                      <TrendingUp className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Video Placeholder */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  60-second demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;