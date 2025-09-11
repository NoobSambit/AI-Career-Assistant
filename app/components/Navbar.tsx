'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, User, MessageSquare, Mail } from 'lucide-react';
import { BRAND_NAME } from '@/lib/brand';

const Navbar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Brain },
    { path: '/resume', label: 'Resume', icon: User },
    { path: '/interview', label: 'Interview', icon: MessageSquare, isNew: true },
    { path: '/email', label: 'Email', icon: Mail },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {BRAND_NAME}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon, isNew }) => (
              <Link
                key={path}
                href={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 relative ${
                  isActive(path)
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
                {isNew && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <div className="flex flex-col space-y-1">
              {navItems.slice(1).map(({ path, label, icon: Icon, isNew }) => (
                <Link
                  key={path}
                  href={path}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all duration-300 relative ${
                    isActive(path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{label}</span>
                  {isNew && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;