import React from 'react';
import Link from 'next/link';
import { Code, Upload, MessageSquare, Mail, Github, Linkedin, AtSign } from 'lucide-react';
import { BRAND_NAME } from '@/lib/brand';

const Footer = () => {
  const tools = [
    { name: 'Resume', href: '/resume', icon: Upload },
    { name: 'Interview', href: '/interview', icon: MessageSquare },
    { name: 'Email', href: '/email', icon: Mail }
  ];

  const contacts = [
    { 
      name: 'Email', 
      href: 'mailto:sambitpradhan.dev2004@gmail.com', 
      icon: AtSign,
      label: 'sambitpradhan.dev2004@gmail.com'
    },
    { 
      name: 'GitHub', 
      href: 'https://github.com/NoobSambit', 
      icon: Github,
      label: '@NoobSambit'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/sambit-pradhan-934755326/', 
      icon: Linkedin,
      label: 'Sambit Pradhan'
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Quick Tools Links */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-6">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact the Dev */}
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Contact the Dev</h4>
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {contacts.map((contact) => {
                  const IconComponent = contact.icon;
                  return (
                    <a
                      key={contact.name}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs"
                      title={contact.label}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{contact.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
              <Code className="h-4 w-4" />
              <span className="text-sm">Built with Next.js • Powered by Gemini 2.0</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              © 2024 {BRAND_NAME}. We don't store your files.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;