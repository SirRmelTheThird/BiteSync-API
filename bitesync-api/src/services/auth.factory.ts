import { PrismaUserRepository } from '../repositories/user.repository';
import { AuthService, createJwtIssuer } from './auth.service';
import { env } from '../config/env';

export function createAuthService(): AuthService {
  const issueToken = createJwtIssuer(env.jwtSecret, env.jwtExpiresIn);
  return new AuthService(new PrismaUserRepository(), issueToken);
}
