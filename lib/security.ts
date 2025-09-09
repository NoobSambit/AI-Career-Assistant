import { NextRequest } from 'next/server';

export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  if (fwd) return fwd.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

export function isAuthorized(req: NextRequest): boolean {
  const requiredKey = process.env.API_KEY;
  if (!requiredKey) return true; // auth disabled by default
  const auth = req.headers.get('authorization') || '';
  const provided = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : '';
  return provided === requiredKey;
}


