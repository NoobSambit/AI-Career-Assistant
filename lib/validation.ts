import { z } from 'zod';

// Shared constants for uploads
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
]);

// Email JSON payload schema
export const EmailSchema = z.object({
  user_input: z.string().min(1).max(8000),
  tone: z.enum(['friendly', 'formal', 'assertive']).default('friendly'),
  context: z.record(z.any()).default({}),
  recipient_relationship: z.string().max(200).optional(),
  purpose: z.string().max(200).optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Interview JSON payload schema
export const InterviewSchema = z.object({
  user_input: z.string().min(1).max(8000),
  question_type: z.enum(['behavioral', 'technical']).default('behavioral'),
  role_context: z.string().max(500).optional(),
});

// Resume text JSON payload schema
export const ResumeTextSchema = z.object({
  user_input: z.string().min(1).max(12000),
  context: z.record(z.any()).default({}).optional(),
});

// Utility: limit string length safely
export function truncate(input: string, max: number): string {
  if (typeof input !== 'string') return '';
  return input.length > max ? input.slice(0, max) : input;
}

// File validation for multipart inputs
export function validateUploadedFile(file: File | null): { ok: true } | { ok: false; reason: 'missing' | 'too_large' | 'unsupported' } {
  if (!file) return { ok: false, reason: 'missing' };
  // size and type are available on File in Next API routes (Node runtime)
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, reason: 'too_large' };
  if (!ALLOWED_MIME_TYPES.has(file.type)) return { ok: false, reason: 'unsupported' };
  return { ok: true };
}


