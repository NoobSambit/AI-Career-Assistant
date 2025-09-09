export function requestId(): string {
  try {
    // @ts-ignore - crypto is global in Node 18+
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now();
  }
}

function redactPII(input: any): any {
  try {
    const str = typeof input === 'string' ? input : JSON.stringify(input);
    // crude redaction: emails and long digit sequences
    return str
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
      .replace(/\b\d{6,}\b/g, '[redacted-number]');
  } catch {
    return '[unserializable]';
  }
}

type LogLevel = 'info' | 'error' | 'warn';

function log(level: LogLevel, msg: string, meta: Record<string, any> = {}) {
  const payload = {
    level,
    msg,
    ...meta,
    ts: new Date().toISOString(),
  };
  try {
    // Redact potentially sensitive data within meta
    const safeMeta = JSON.parse(redactPII(JSON.stringify(payload)));
    // eslint-disable-next-line no-console
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](safeMeta);
  } catch {
    // eslint-disable-next-line no-console
    console.log(payload);
  }
}

export function logInfo(msg: string, meta?: Record<string, any>) {
  log('info', msg, meta);
}

export function logError(msg: string, meta?: Record<string, any>) {
  log('error', msg, meta);
}

export function logWarn(msg: string, meta?: Record<string, any>) {
  log('warn', msg, meta);
}


