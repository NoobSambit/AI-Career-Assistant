import React from 'react';
import Link from 'next/link';
import { Upload, MessageSquare, Mail, ArrowRight } from 'lucide-react';

const AgentsOverview = () => {
  const agents = [
    {
      name: 'Resume Booster',
      description: 'Improve keywords, structure, and scores.',
      href: '/resume',
      icon: Upload,
      color: 'blue',
      features: [
        'ATS optimization',
        'Keyword enhancement',
        'Format improvements'
      ]
    },
    {
      name: 'Interview Coach',
      description: 'Practice STAR answers with real prompts.',
      href: '/interview',
      icon: MessageSquare,
      color: 'indigo',
      features: [
        'STAR method training',
        'Common questions',
        'Answer structure'
      ]
    },
    {
      name: 'Email Rewriter',
      description: 'Polish outreach and follow‑ups.',
      href: '/email',
      icon: Mail,
      color: 'teal',
      features: [
        'Professional tone',
        'Clear messaging',
        'Response rates'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-700',
        hover: 'hover:border-blue-300 dark:hover:border-blue-600'
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-700',
        hover: 'hover:border-indigo-300 dark:hover:border-indigo-600'
      },
      teal: {
        bg: 'bg-teal-100 dark:bg-teal-900/30',
        text: 'text-teal-700 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-700',
        hover: 'hover:border-teal-300 dark:hover:border-teal-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          const colorClasses = getColorClasses(agent.color);
          
          return (
            <div
              key={agent.name}
              className={`bg-white dark:bg-gray-800 rounded-xl border ${colorClasses.border} ${colorClasses.hover} p-6 hover:shadow-lg transition-all duration-200 group`}
            >
              <div className="space-y-4">
                {/* Icon & Title */}
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                    <IconComponent className={`h-5 w-5 ${colorClasses.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agent.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {agent.description}
                </p>

                {/* Features */}
                <ul className="space-y-1">
                  {agent.features.map((feature, index) => (
                    <li key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-start">
                      <span className={`${colorClasses.text} mr-2 mt-0.5`}>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={agent.href}
                  className={`inline-flex items-center text-sm font-medium ${colorClasses.text} group-hover:underline`}
                >
                  Open tool
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AgentsOverview;
