import { NextRequest, NextResponse } from 'next/server';
import { generateResumeHTML, generateResumeFilename } from '@/lib/pdfGenerator';
import { EnhancedResume } from '@/lib/schemas/enhancedResume';

export const runtime = 'nodejs';

/**
 * PDF Download Endpoint
 * Generates a clean, ATS-friendly PDF from enhanced resume data
 */
export async function POST(request: NextRequest) {
  try {
    const data: EnhancedResume = await request.json();
    
    // Generate HTML
    const html = generateResumeHTML(data);
    
    // Return HTML that can be printed to PDF by the browser
    // This is the cleanest approach without additional dependencies
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${generateResumeFilename(data.enhancedResume.personalInfo.name)}"`,
      },
    });
  } catch (error) {
    console.error('[PDF API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
