import pino from 'pino';
import { env } from './env';

/**
 * One logger instance for the whole app. Structured (JSON) logs in
 * production so they're easy to ship to a log aggregator; pretty-printed
 * and human-readable in development.
 *
 * Import this instead of using console.log/console.error anywhere in the
 * codebase — that keeps log formatting and levels consistent, and means
 * log output can be redirected/filtered in one place later.
 */
export const logger = pino({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  transport:
    env.nodeEnv === 'production'
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true } },
});
