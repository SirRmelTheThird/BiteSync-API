import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async Express handler so rejected promises are forwarded to
 * next(err) automatically. Without this, every controller needs its own
 * try/catch (DRY violation) or a thrown/rejected error inside an async
 * handler silently hangs the request — Express does not catch those by
 * default.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
