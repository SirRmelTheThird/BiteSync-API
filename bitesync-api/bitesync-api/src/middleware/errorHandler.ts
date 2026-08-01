import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';

/**
 * Single place where any error thrown or passed to next() becomes an HTTP
 * response. Keeps controllers free of res.status(...).json(...) error
 * boilerplate and guarantees a consistent error shape for API consumers
 * (including the Expo app).
 *
 * Must be registered LAST, after all routes, per Express convention.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    // Operational errors (bad input, missing resource, auth failure) are
    // expected traffic, not bugs — log at 'warn', not 'error'.
    logger.warn({ err, path: req.originalUrl }, err.message);
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    logger.warn({ err, path: req.originalUrl }, 'Validation failed');
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Unexpected/programmer errors: log full detail server-side at 'error'
  // level, but never leak internals (stack traces, DB error text) to the
  // client.
  logger.error({ err, path: req.originalUrl }, 'Unhandled error');
  return res.status(500).json({ error: 'Internal server error' });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}
