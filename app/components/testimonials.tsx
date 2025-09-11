import React from 'react';
import { Star, Users, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Cleared ATS, got 3 callbacks in a week after using Resume Booster.",
      author: "Priya S.",
      role: "Product Manager",
      rating: 5
    },
    {
      quote: "My answers finally clicked—2 on‑sites in a week with Interview Coach.",
      author: "Marcus T.",
      role: "Software Engineer",
      rating: 5
    },
    {
      quote: "Cold emails started getting replies after Email Rewriter polish.",
      author: "Sarah L.",
      role: "Sales Rep",
      rating: 5
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '1,241',
      label: 'Happy users',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: TrendingUp,
      value: '3 tools',
      label: 'Job search help',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'User rating',
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  const tools = [
    { name: 'Resume', href: '/resume', description: 'ATS optimization' },
    { name: 'Interview', href: '/interview', description: 'STAR method prep' },
    { name: 'Email', href: '/email', description: 'Professional tone' }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="space-y-16">
        {/* Results + Stats */}
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Proven results
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-full bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-gray-900 dark:text-white mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">— {testimonial.author}</span>
                <span className="ml-2">{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Use Cases Strip */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose your tool
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get specific help for every step of your job search
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {tool.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
