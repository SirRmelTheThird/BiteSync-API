import rateLimit from 'express-rate-limit';

/**
 * Two tiers, not one, because auth endpoints need much tighter limits than
 * general API traffic. A single global limit would either be too loose to
 * stop password-guessing on /auth/login, or too strict for normal use of
 * /meals.
 */

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true, // return RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// Deliberately strict: login/register are the highest-value target for
// brute-force and credential-stuffing attacks.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later' },
});
