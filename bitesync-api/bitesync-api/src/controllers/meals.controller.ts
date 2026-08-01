import type { Request, Response } from 'express';
import { createMealsService } from '../services/meals.factory';
import {
  createMealSchema,
  dateQuerySchema,
  paginationQuerySchema,
  summaryQuerySchema,
} from '../validators/meal.validator';
import { AppError } from '../utils/AppError';

/**
 * Controllers do exactly one job each: parse/validate the request, call
 * the service, shape the response. No business logic, no direct Prisma
 * access, no try/catch (asyncHandler + errorHandler cover that).
 *
 * req.userId is guaranteed to be set here because requireAuth runs first
 * on every route in meals.routes.ts — but we still guard for it, since
 * "guaranteed by route wiring" is a convention, not a type-level fact.
 */
const mealsService = createMealsService();

function requireUserId(req: Request): string {
  if (!req.userId) {
    throw AppError.unauthorized();
  }
  return req.userId;
}

export async function listMeals(req: Request, res: Response) {
  const userId = requireUserId(req);
  const { date } = dateQuerySchema.parse(req.query);

  if (date) {
    const meals = await mealsService.getMealsByDate(userId, date);
    return res.json({ items: meals, nextCursor: null });
  }

  const { limit, cursor } = paginationQuerySchema.parse(req.query);
  const result = await mealsService.getAllMeals(userId, limit, cursor);
  res.json(result);
}

export async function addMeal(req: Request, res: Response) {
  const userId = requireUserId(req);
  const data = createMealSchema.parse(req.body);
  const meal = await mealsService.createMeal(userId, data);
  res.status(201).json(meal);
}

export async function dailySummary(req: Request, res: Response) {
  const userId = requireUserId(req);
  const { date } = summaryQuerySchema.parse(req.query);
  const summary = await mealsService.getDailySummary(userId, date);
  res.json(summary);
}
