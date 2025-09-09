import { NextResponse } from 'next/server';

function base(payload: Record<string, any>, requestId: string) {
  return {
    ...payload,
    request_id: requestId,
    timestamp: new Date().toISOString(),
  };
}

export function jsonOk(requestId: string, data: Record<string, any> = {}, init?: ResponseInit) {
  return NextResponse.json(base(data, requestId), init);
}

export function jsonBadRequest(requestId: string, msg = 'Invalid payload') {
  return NextResponse.json(base({ error: msg }, requestId), { status: 400 });
}

export function jsonUnauthorized(requestId: string) {
  return NextResponse.json(base({ error: 'Unauthorized' }, requestId), { status: 401 });
}

export function jsonForbidden(requestId: string) {
  return NextResponse.json(base({ error: 'Forbidden' }, requestId), { status: 403 });
}

export function jsonTooLarge(requestId: string) {
  return NextResponse.json(base({ error: 'File too large' }, requestId), { status: 413 });
}

export function jsonUnsupported(requestId: string) {
  return NextResponse.json(base({ error: 'Unsupported file type' }, requestId), { status: 415 });
}

export function jsonTooManyRequests(requestId: string) {
  return NextResponse.json(base({ error: 'Too Many Requests' }, requestId), { status: 429 });
}

export function jsonServerError(requestId: string) {
  return NextResponse.json(base({ error: 'Internal Server Error' }, requestId), { status: 500 });
}

export function jsonServiceUnavailable(requestId: string) {
  return NextResponse.json(base({ error: 'Service Unavailable' }, requestId), { status: 503 });
}


