type LogLevel = 'info' | 'warn' | 'error' | 'critical';

interface LogPayload {
  message: string;
  context?: Record<string, any>;
  error?: Error | unknown;
}

export const logger = {
  log: (level: LogLevel, payload: LogPayload) => {
    const timestamp = new Date().toISOString();
    const formattedLog = JSON.stringify({
      timestamp,
      level,
      message: payload.message,
      context: payload.context,
      error: payload.error instanceof Error ? {
        message: payload.error.message,
        stack: payload.error.stack,
        name: payload.error.name,
      } : payload.error,
    });

    switch (level) {
      case 'info':
        console.log(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
      case 'critical':
        console.error(formattedLog);
        break;
    }
  },

  info: (message: string, context?: Record<string, any>) => 
    logger.log('info', { message, context }),

  warn: (message: string, context?: Record<string, any>) => 
    logger.log('warn', { message, context }),

  error: (message: string, error?: Error | unknown, context?: Record<string, any>) => 
    logger.log('error', { message, error, context }),

  critical: (message: string, error?: Error | unknown, context?: Record<string, any>) => 
    logger.log('critical', { message, error, context }),
};
