import * as mammoth from 'mammoth';
import { extractTextFromImage } from './gemini';

export interface DocumentParseResult {
  text: string;
  method: 'pdf-parse' | 'mammoth' | 'ocr' | 'error';
  error?: string;
  metadata?: {
    pages?: number;
    wordCount?: number;
    hasImages?: boolean;
  };
}

/**
 * Extracts text from PDF files using pdf-parse
 * Falls back to OCR if pdf-parse fails or returns minimal text
 */
async function extractFromPDF(buffer: Buffer, mimeType: string): Promise<DocumentParseResult> {
  try {
    // Import the pdf-parse library directly from lib to avoid debug mode issues
    const pdfParseLib = require('pdf-parse/lib/pdf-parse.js');
    
    // Use the library function directly, bypassing the debug mode wrapper
    const data = await pdfParseLib(buffer);
    const extractedText = data.text?.trim() || '';
    
    console.log('PDF extraction result:', {
      wordCount: extractedText.split(/\s+/).filter(word => word.length > 0).length,
      textPreview: extractedText.substring(0, 200),
      pages: data.numpages
    });
    
    // Check if we got meaningful text (more than just whitespace/minimal content)
    const wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount >= 10) {
      // Success with pdf-parse
      return {
        text: extractedText,
        method: 'pdf-parse',
        metadata: {
          pages: data.numpages,
          wordCount,
          hasImages: false // pdf-parse doesn't extract images
        }
      };
    } else {
      // pdf-parse didn't extract enough text, fallback to OCR
      console.log('PDF text extraction yielded minimal content, falling back to OCR');
      return await extractWithOCR(buffer, mimeType);
    }
  } catch (error) {
    console.log('PDF parsing failed, falling back to OCR:', error);
    return await extractWithOCR(buffer, mimeType);
  }
}

/**
 * Extracts text from DOCX files using mammoth
 */
async function extractFromDOCX(buffer: Buffer): Promise<DocumentParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const extractedText = result.value?.trim() || '';
    
    if (extractedText.length < 10) {
      return {
        text: '',
        method: 'error',
        error: 'DOCX file appears to be empty or contains no extractable text'
      };
    }

    const wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length;
    
    return {
      text: extractedText,
      method: 'mammoth',
      metadata: {
        wordCount,
        hasImages: false // mammoth extracts text only
      }
    };
  } catch (error) {
    return {
      text: '',
      method: 'error',
      error: `Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Uses Gemini OCR as fallback for PDFs that don't contain extractable text
 */
async function extractWithOCR(buffer: Buffer, mimeType: string): Promise<DocumentParseResult> {
  try {
    const base64 = buffer.toString('base64');
    const ocrPrompt = `Extract all text content from this document image. Please provide:
1. All visible text in reading order
2. Preserve formatting like headers, paragraphs, and lists
3. Include any tables or structured data
4. Maintain the logical flow of the document

Return only the extracted text content without additional commentary.`;

    const extractedText = await extractTextFromImage(base64, mimeType, ocrPrompt);
    
    if (!extractedText || extractedText.trim().length < 10) {
      return {
        text: '',
        method: 'error',
        error: 'OCR extraction failed or returned minimal content'
      };
    }

    const wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length;
    
    return {
      text: extractedText.trim(),
      method: 'ocr',
      metadata: {
        wordCount,
        hasImages: true // OCR processes visual content
      }
    };
  } catch (error) {
    return {
      text: '',
      method: 'error',
      error: `OCR extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Main document parsing function that handles PDF, DOCX, and image files
 */
export async function parseDocument(file: File): Promise<DocumentParseResult> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    switch (mimeType) {
      case 'application/pdf':
        return await extractFromPDF(buffer, mimeType);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractFromDOCX(buffer);
      
      case 'image/png':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/webp':
      case 'image/gif':
        return await extractWithOCR(buffer, mimeType);
      
      default:
        return {
          text: '',
          method: 'error',
          error: `Unsupported file type: ${mimeType}. Supported types: PDF, DOCX, PNG, JPG, WEBP, GIF`
        };
    }
  } catch (error) {
    return {
      text: '',
      method: 'error',
      error: `Document parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Utility function to get human-readable file type name
 */
export function getFileTypeName(mimeType: string): string {
  switch (mimeType) {
    case 'application/pdf':
      return 'PDF';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'DOCX';
    case 'image/png':
      return 'PNG';
    case 'image/jpeg':
    case 'image/jpg':
      return 'JPG';
    case 'image/webp':
      return 'WebP';
    case 'image/gif':
      return 'GIF';
    default:
      return 'Unknown';
  }
}

/**
 * Utility function to check if a file type is supported
 */
export function isSupportedFileType(mimeType: string): boolean {
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif'
  ];
  return supportedTypes.includes(mimeType);
}
