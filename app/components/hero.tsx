import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Upload, Star } from 'lucide-react';
import { BRAND_NAME, TAGLINE } from '@/lib/brand';

const Hero = () => {
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
              <span>Avg +18 ATS points</span>
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
              Upload your resume or a screenshot. Get a recruiter‑ready version with measurable ATS gains.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/resume"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Upload and enhance your resume"
            >
              <Upload className="h-5 w-5 mr-2" />
              Try it with your resume
            </Link>
            <button
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 font-semibold rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-label="Watch demo video"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch 60‑sec demo
            </button>
          </div>

          {/* Trust Line */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We don't store your files. Delete anytime.
          </p>
        </div>

        {/* Right Column - Media */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* Before/After Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Before</h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                    <div className="mt-3 text-xs text-red-600 dark:text-red-400 font-medium">
                      ATS Score: 42/100
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">After</h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-200 dark:bg-blue-700 rounded w-full"></div>
                      <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
                      <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-4/5"></div>
                    </div>
                    <div className="mt-3 text-xs text-green-600 dark:text-green-400 font-medium">
                      ATS Score: 89/100 (+47)
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
