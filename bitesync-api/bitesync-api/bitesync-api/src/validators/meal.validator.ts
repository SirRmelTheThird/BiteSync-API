import { z } from 'zod';

/**
 * Validation lives here, not in the controller. This is the Single
 * Responsibility fix: the controller's job is to handle the HTTP
 * request/response cycle, not to know the business rules for what makes
 * a valid meal. If a rule changes (e.g. calories must be positive), this
 * is the only file that changes.
 */

export const createMealSchema = z.object({
  name: z.string().trim().min(1, 'name is required').max(120),
  calories: z.number().int().nonnegative(),
  protein: z.number().int().nonnegative(),
  carbs: z.number().int().nonnegative(),
  fat: z.number().int().nonnegative(),
});

export type CreateMealInput = z.infer<typeof createMealSchema>;

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format');

export const dateQuerySchema = z.object({
  date: dateStringSchema.optional(),
});

export const summaryQuerySchema = z.object({
  date: dateStringSchema,
});

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  cursor: z.string().optional(),
});
