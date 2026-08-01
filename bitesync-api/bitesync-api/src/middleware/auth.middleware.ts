import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

type AccessTokenPayload = { userId: string };

/**
 * Protects a route: requires a valid `Authorization: Bearer <token>`
 * header, verifies it, and attaches `req.userId` for downstream
 * controllers. Every currently-open endpoint (list/create meals, summary)
 * gets wrapped with this.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing or malformed Authorization header');
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
    req.userId = payload.userId;
    next();
  } catch {
    throw AppError.unauthorized('Invalid or expired token');
  }
}
