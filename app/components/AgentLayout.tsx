'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AgentLayoutProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  children: React.ReactNode;
}

const AgentLayout: React.FC<AgentLayoutProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  children 
}) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-400 hover:text-gray-200 mb-6 transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-blue-900/30 text-blue-300">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
                  <p className="text-gray-300 mt-1">{description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;