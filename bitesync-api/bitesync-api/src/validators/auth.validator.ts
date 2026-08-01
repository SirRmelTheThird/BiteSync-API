import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  // Minimum length only — deliberately not enforcing complexity rules
  // (uppercase/symbol requirements) here. That's a UX trade-off, not an
  // oversight: length is the single strongest predictor of password
  // strength, and complexity rules mostly just push people toward
  // predictable substitutions (e.g. "Password1!").
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
