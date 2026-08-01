import type { Request, Response } from 'express';
import { createAuthService } from '../services/auth.factory';
import { credentialsSchema } from '../validators/auth.validator';

const authService = createAuthService();

export async function register(req: Request, res: Response) {
  const { email, password } = credentialsSchema.parse(req.body);
  const result = await authService.register(email, password);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { email, password } = credentialsSchema.parse(req.body);
  const result = await authService.login(email, password);
  res.json(result);
}
