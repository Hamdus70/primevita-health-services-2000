import * as Sentry from '@sentry/nextjs';

export function captureException(error: Error | unknown, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Captured exception:', error, context);
  }
  
  Sentry.captureException(error, {
    extra: context,
  });
}

export function captureMessage(message: string, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Captured message:', message, context);
  }
  
  Sentry.captureMessage(message, {
    extra: context,
  });
}
