/**
 * Centralized, validated environment configuration.
 *
 * Why this exists: without it, a missing DATABASE_URL or JWT_SECRET only
 * fails the moment it's first used — mid-request, in production, hours
 * after deploy. Validating at startup makes the failure immediate, loud,
 * and impossible to miss.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  databaseUrl: requireEnv('DATABASE_URL'),
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
} as const;
