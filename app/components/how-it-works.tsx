import React from 'react';
import { Upload, Sparkles, Send } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload',
      description: 'Drop your resume or paste a screenshot'
    },
    {
      icon: Sparkles,
      title: 'We enhance it',
      description: 'AI analyzes and optimizes for ATS systems'
    },
    {
      icon: Send,
      title: 'You apply with confidence',
      description: 'Get measurable improvements and more callbacks'
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          How it works
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Three simple steps to transform your resume and land more interviews
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center z-10">
                  {index + 1}
                </div>
                
                {/* Icon Container */}
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                  <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-8">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
