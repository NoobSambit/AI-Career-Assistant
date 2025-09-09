import React from 'react';
import { Code } from 'lucide-react';
import { BRAND_NAME } from '@/lib/brand';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <Code className="h-4 w-4" />
          <span>Built with Next.js • Powered by Google Gemini 2.0 Flash</span>
        </div>
        <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-500">
          © 2024 {BRAND_NAME}. We don't store your files.
        </div>
      </div>
    </footer>
  );
};

export default Footer;