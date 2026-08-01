import { PrismaUserRepository } from '../repositories/user.repository';
import { AuthService, createJwtIssuer } from './auth.service';
import { env } from '../config/env';

/**
 * Wires the concrete repository and a real JWT issuer into AuthService.
 * Same one-factory-function pattern as meals.factory.ts — no DI container.
 */
export function createAuthService(): AuthService {
  const issueToken = createJwtIssuer(env.jwtSecret, env.jwtExpiresIn);
  return new AuthService(new PrismaUserRepository(), issueToken);
}
