/**
 * Resume PDF Generator
 * Creates a clean, ATS-friendly PDF in Jake's Resume style (LaTeX-inspired)
 */

import { EnhancedResume } from './schemas/enhancedResume';

// Using vanilla approach without external dependencies for now
// We'll generate a clean HTML that can be converted to PDF

export function generateResumeHTML(data: EnhancedResume): string {
  const { enhancedResume } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${enhancedResume.personalInfo.name} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Computer Modern', 'Latin Modern Roman', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      background: white;
      padding: 0.5in 0.75in;
      max-width: 8.5in;
      margin: 0 auto;
    }
    
    /* Jake's Resume Header Style */
    .header {
      text-align: center;
      margin-bottom: 0.3in;
      border-bottom: 1px solid #000;
      padding-bottom: 0.1in;
    }
    
    .header h1 {
      font-size: 20pt;
      font-weight: bold;
      margin-bottom: 0.05in;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
    }
    
    .header .contact {
      font-size: 10pt;
      margin-top: 0.05in;
    }
    
    .header .contact-item {
      display: inline;
      margin: 0 0.15in;
    }
    
    .header .contact-item::before {
      content: " · ";
      margin: 0 0.1in;
    }
    
    .header .contact-item:first-child::before {
      content: "";
      margin: 0;
    }
    
    /* Section Headers */
    .section {
      margin-top: 0.15in;
      margin-bottom: 0.1in;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1pt;
      border-bottom: 0.5pt solid #000;
      padding-bottom: 0.02in;
      margin-bottom: 0.1in;
    }
    
    /* Experience Items */
    .experience-item, .education-item, .project-item {
      margin-bottom: 0.12in;
      page-break-inside: avoid;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.02in;
    }
    
    .item-title {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .item-subtitle {
      font-style: italic;
      font-size: 10pt;
      margin-bottom: 0.02in;
    }
    
    .item-date {
      font-size: 10pt;
      font-style: italic;
    }
    
    .item-location {
      font-size: 10pt;
      color: #333;
    }
    
    /* Bullet Points */
    ul {
      margin-left: 0.25in;
      margin-top: 0.05in;
      list-style-type: none;
    }
    
    ul li {
      margin-bottom: 0.05in;
      position: relative;
      padding-left: 0.15in;
    }
    
    ul li::before {
      content: "•";
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    /* Skills Section */
    .skills-section {
      margin-bottom: 0.1in;
    }
    
    .skill-category {
      margin-bottom: 0.05in;
    }
    
    .skill-category-name {
      font-weight: bold;
      display: inline;
    }
    
    .skill-list {
      display: inline;
      margin-left: 0.1in;
    }
    
    /* Professional Summary */
    .summary {
      text-align: justify;
      margin-bottom: 0.1in;
      hyphens: auto;
    }
    
    /* Links */
    a {
      color: #000;
      text-decoration: none;
    }
    
    /* Print Optimization */
    @media print {
      body {
        padding: 0;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
    
    /* Compact spacing for fitting content */
    .compact-list li {
      margin-bottom: 0.03in;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>${enhancedResume.personalInfo.name}</h1>
    <div class="contact">
      ${enhancedResume.personalInfo.phone ? `<span class="contact-item">${enhancedResume.personalInfo.phone}</span>` : ''}
      ${enhancedResume.personalInfo.email ? `<span class="contact-item">${enhancedResume.personalInfo.email}</span>` : ''}
      ${enhancedResume.personalInfo.location ? `<span class="contact-item">${enhancedResume.personalInfo.location}</span>` : ''}
      ${enhancedResume.personalInfo.linkedin ? `<span class="contact-item">${enhancedResume.personalInfo.linkedin}</span>` : ''}
      ${enhancedResume.personalInfo.portfolio ? `<span class="contact-item">${enhancedResume.personalInfo.portfolio}</span>` : ''}
    </div>
  </div>
  
  <!-- Professional Summary -->
  ${enhancedResume.professionalSummary ? `
  <div class="section">
    <h2 class="section-title">Professional Summary</h2>
    <p class="summary">${enhancedResume.professionalSummary}</p>
  </div>
  ` : ''}
  
  <!-- Experience -->
  ${enhancedResume.experience && enhancedResume.experience.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Experience</h2>
    ${enhancedResume.experience.map(exp => `
      <div class="experience-item">
        <div class="item-header">
          <div>
            <div class="item-title">${exp.company}</div>
            <div class="item-subtitle">${exp.role}</div>
          </div>
          <div class="item-date">${exp.period}</div>
        </div>
        ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
        ${exp.bullets && exp.bullets.length > 0 ? `
          <ul>
            ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
          </ul>
        ` : ''}
        ${exp.keyAchievements && exp.keyAchievements.length > 0 ? `
          <ul style="margin-top: 0.05in;">
            ${exp.keyAchievements.map(ach => `<li><strong>Achievement:</strong> ${ach}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <!-- Education -->
  ${enhancedResume.education && enhancedResume.education.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Education</h2>
    ${enhancedResume.education.map(edu => `
      <div class="education-item">
        <div class="item-header">
          <div>
            <div class="item-title">${edu.institution}</div>
            <div class="item-subtitle">${edu.degree}${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}</div>
          </div>
          <div class="item-date">${edu.year}</div>
        </div>
        ${edu.achievements && edu.achievements.length > 0 ? `
          <ul class="compact-list">
            ${edu.achievements.map(ach => `<li>${ach}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <!-- Skills -->
  ${enhancedResume.skills ? `
  <div class="section">
    <h2 class="section-title">Technical Skills</h2>
    <div class="skills-section">
      ${enhancedResume.skills.technical && enhancedResume.skills.technical.length > 0 ? `
        <div class="skill-category">
          <span class="skill-category-name">Technical:</span>
          <span class="skill-list">${enhancedResume.skills.technical.join(', ')}</span>
        </div>
      ` : ''}
      ${enhancedResume.skills.tools && enhancedResume.skills.tools.length > 0 ? `
        <div class="skill-category">
          <span class="skill-category-name">Tools & Platforms:</span>
          <span class="skill-list">${enhancedResume.skills.tools.join(', ')}</span>
        </div>
      ` : ''}
      ${enhancedResume.skills.soft && enhancedResume.skills.soft.length > 0 ? `
        <div class="skill-category">
          <span class="skill-category-name">Soft Skills:</span>
          <span class="skill-list">${enhancedResume.skills.soft.join(', ')}</span>
        </div>
      ` : ''}
      ${enhancedResume.skills.certifications && enhancedResume.skills.certifications.length > 0 ? `
        <div class="skill-category">
          <span class="skill-category-name">Certifications:</span>
          <span class="skill-list">${enhancedResume.skills.certifications.join(', ')}</span>
        </div>
      ` : ''}
    </div>
  </div>
  ` : ''}
  
  <!-- Projects -->
  ${enhancedResume.projects && enhancedResume.projects.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Projects</h2>
    ${enhancedResume.projects.map(project => `
      <div class="project-item">
        <div class="item-header">
          <div class="item-title">${project.name}</div>
          ${project.duration ? `<div class="item-date">${project.duration}</div>` : ''}
        </div>
        ${project.technologies && project.technologies.length > 0 ? `
          <div class="item-subtitle">${project.technologies.join(' · ')}</div>
        ` : ''}
        <p style="margin-top: 0.05in; margin-bottom: 0.05in;">${project.description}</p>
        ${project.highlights && project.highlights.length > 0 ? `
          <ul class="compact-list">
            ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
          </ul>
        ` : ''}
        ${project.link ? `<div style="margin-top: 0.03in; font-size: 9pt;"><strong>Link:</strong> ${project.link}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
</body>
</html>
  `.trim();
}

/**
 * Generate a downloadable filename for the resume PDF
 */
export function generateResumeFilename(name: string): string {
  const sanitized = name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  return `${sanitized}_Resume.pdf`;
}
