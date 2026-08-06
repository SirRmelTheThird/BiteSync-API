import { AppError } from '../utils/AppError';
import type {
  CreateMealData,
  IMealRepository,
  MealTotals,
  PaginatedMeals,
} from '../repositories/meal.repository';

export class MealsService {
  constructor(private readonly repository: IMealRepository) {}

  getAllMeals(userId: string, limit: number, cursor?: string): Promise<PaginatedMeals> {
    return this.repository.findAll(userId, limit, cursor);
  }

  async getMealsByDate(userId: string, date: string) {
    const { start, end } = dayRange(date);
    return this.repository.findByDateRange(userId, start, end);
  }

  createMeal(userId: string, data: CreateMealData) {
    return this.repository.create(userId, data);
  }

  async getDailySummary(userId: string, date: string): Promise<MealTotals> {
    const { start, end } = dayRange(date);
    return this.repository.sumByDateRange(userId, start, end);
  }
}

/** Converts a "YYYY-MM-DD" string into a UTC start/end range for that day. */
function dayRange(date: string): { start: Date; end: Date } {
  const start = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(start.getTime())) {
    throw AppError.badRequest(`Invalid date: ${date}`);
  }

  const end = new Date(`${date}T23:59:59.999Z`);
  return { start, end };
}
