'use client';

import { useState } from 'react';
import { EnhancedResume } from '../../../lib/schemas/enhancedResume';
import { ResultsSummary } from './results-summary';
import { OutputTabs, OutputTab } from './output-tabs';
import { ATSAnalysisView } from './ats-analysis-view';
import { IndustryAnalysisView } from './industry-analysis-view';
import { CareerAnalysisView } from './career-analysis-view';
import { Briefcase, TrendingUp, Lightbulb, FileText, Target, BarChart3, TrendingUp as Growth, Users } from 'lucide-react';

interface EnhancedOutputProps {
  data: EnhancedResume;
}

export function EnhancedOutput({ data }: EnhancedOutputProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<OutputTab>('enhanced');

  const handleCopy = async () => {
    let content = '';
    
    switch (activeTab) {
      case 'enhanced':
        content = `${data.enhancedResume.personalInfo.name}\n${data.enhancedResume.personalInfo.email} | ${data.enhancedResume.personalInfo.phone}\n${data.enhancedResume.personalInfo.location}\n\nPROFESSIONAL SUMMARY:\n${data.enhancedResume.professionalSummary}\n\nEXPERIENCE:\n${data.enhancedResume.experience.map(exp => 
          `${exp.company} - ${exp.role} (${exp.period})\n${exp.bullets.map(bullet => `• ${bullet}`).join('\n')}`
        ).join('\n\n')}\n\nSKILLS:\nTechnical: ${data.enhancedResume.skills.technical.join(', ')}\nTools: ${data.enhancedResume.skills.tools.join(', ')}`;
        break;
      case 'ats':
        content = `ATS Analysis:\nScore: ${data.atsAnalysis.score}/100\nKeyword Density: ${data.atsAnalysis.keywordDensity}%\nMissing Keywords: ${data.atsAnalysis.missingKeywords.join(', ')}`;
        break;
      case 'improvements':
        content = data.improvements.map(imp => `${imp.title}: ${imp.description} (${imp.impact} Impact)`).join('\n\n');
        break;
      case 'industry':
        content = `Industry: ${data.industryAnalysis.industry}\nRole Alignment: ${data.industryAnalysis.roleAlignment}/100\nMarket Demand: ${data.industryAnalysis.marketDemand}/100`;
        break;
      case 'career':
        content = `Current Level: ${data.careerAnalysis.currentLevel}\nNext Steps: ${data.careerAnalysis.nextSteps.join(', ')}`;
        break;
    }
    
    await navigator.clipboard.writeText(content);
  };

  const handleExport = (type: 'pdf' | 'md') => {
    // TODO: Implement export functionality
    console.log(`Export ${type} requested`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'enhanced':
        return (
          <div className="space-y-8">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Contact Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Name:</span> {data.enhancedResume.personalInfo.name}</div>
                  <div><span className="font-medium">Email:</span> {data.enhancedResume.personalInfo.email}</div>
                  <div><span className="font-medium">Phone:</span> {data.enhancedResume.personalInfo.phone}</div>
                  <div><span className="font-medium">Location:</span> {data.enhancedResume.personalInfo.location}</div>
                  {data.enhancedResume.personalInfo.linkedin && (
                    <div><span className="font-medium">LinkedIn:</span> {data.enhancedResume.personalInfo.linkedin}</div>
                  )}
                  {data.enhancedResume.personalInfo.portfolio && (
                    <div><span className="font-medium">Portfolio:</span> {data.enhancedResume.personalInfo.portfolio}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Professional Summary
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-prose">
                  {data.enhancedResume.professionalSummary}
                </p>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Enhanced Experience
              </h3>
              <div className="space-y-6">
                {data.enhancedResume.experience.map((exp, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{exp.role}</h4>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {exp.period} {exp.location && `• ${exp.location}`}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {(exp.bullets || []).filter(bullet => 
                        typeof bullet === 'string' && bullet.length > 10 && bullet.length < 1000 && !bullet.includes('{"')
                      ).map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start space-x-3">
                          <span className="text-blue-500 mt-2 flex-shrink-0">•</span>
                          <span className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-prose">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {exp.keyAchievements && exp.keyAchievements.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Key Achievements:</h5>
                        <ul className="space-y-1">
                          {exp.keyAchievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-sm text-green-700 dark:text-green-300 flex items-start space-x-2">
                              <span className="text-green-500 mt-1 flex-shrink-0">★</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Education</h3>
              <div className="space-y-4">
                {data.enhancedResume.education.map((edu, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{edu.degree}</h4>
                        <p className="text-blue-600 dark:text-blue-400">{edu.institution}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <p>{edu.year}</p>
                        {edu.gpa && <p>{edu.gpa}</p>}
                      </div>
                    </div>
                    {edu.achievements && (
                      <ul className="mt-2 space-y-1">
                        {edu.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-sm text-gray-600 dark:text-gray-400">• {achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Optimized Skills
              </h3>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(data.enhancedResume.skills.technical || []).filter(skill => 
                      typeof skill === 'string' && skill.length < 100 && !skill.includes('{')
                    ).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Tools & Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {(data.enhancedResume.skills.tools || []).filter(tool => 
                      typeof tool === 'string' && tool.length < 100 && !tool.includes('{')
                    ).map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(data.enhancedResume.skills.soft || []).filter(skill => 
                      typeof skill === 'string' && skill.length < 100 && !skill.includes('{')
                    ).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            {data.enhancedResume.projects && data.enhancedResume.projects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Projects</h3>
                <div className="space-y-4">
                  {data.enhancedResume.projects.map((project, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</h4>
                        {project.link && (
                          <a href={project.link} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.highlights && (
                        <ul className="space-y-1">
                          {project.highlights.map((highlight, achIndex) => (
                            <li key={achIndex} className="text-sm text-gray-600 dark:text-gray-400">• {highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Changes Made */}
            {data.improvements && data.improvements.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Key Improvements Made
                </h4>
                <div className="grid gap-3">
                  {data.improvements.slice(0, 3).map((improvement, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-blue-800 dark:text-blue-200 font-medium">{improvement.title}</p>
                          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">{improvement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>📊 Professional resume enhanced</span>
              <span>⏱️ ATS-optimized format</span>
              <span>🎯 Career-focused content</span>
            </div>
          </div>
        );

      case 'ats':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              ATS & Keyword Analysis
            </h3>
            <ATSAnalysisView analysis={data.atsAnalysis} />
          </div>
        );

      case 'improvements':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Strategic Improvements
            </h3>
            <div className="space-y-4">
              {data.improvements.map((improvement, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        improvement.impact?.toLowerCase() === 'high' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : improvement.impact?.toLowerCase() === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      }`}>
                        {improvement.impact} Impact
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        improvement.effort?.toLowerCase() === 'low'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : improvement.effort?.toLowerCase() === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {improvement.effort} Effort
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {improvement.category}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {improvement.title}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    {improvement.description}
                  </p>
                  {improvement.examples && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Before:</p>
                        <p className="text-sm text-red-700 dark:text-red-300">{improvement.examples.before}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">After:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{improvement.examples.after}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'industry':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Industry Analysis
            </h3>
            <IndustryAnalysisView analysis={data.industryAnalysis} />
          </div>
        );

      case 'career':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Growth className="h-5 w-5 mr-2" />
              Career Progression Analysis
            </h3>
            <CareerAnalysisView analysis={data.careerAnalysis} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden">
      <ResultsSummary
        assessment={data.assessment}
        onCopy={handleCopy}
        onExport={handleExport}
      />
      
      <OutputTabs value={activeTab} onChange={setActiveTab} />
      
      <div className="p-6 lg:p-8">
        {renderTabContent()}
      </div>
      
      {/* Trust message */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          📄 Advanced resume intelligence powered by career optimization expertise
        </p>
      </div>
    </div>
  );
}

export type { EnhancedOutputProps };
