import type { Meal } from '@prisma/client';
import type {
  CreateMealData,
  IMealRepository,
  MealTotals,
  PaginatedMeals,
} from '../../meal.repository';

export class FakeMealRepository implements IMealRepository {
  private meals: Meal[] = [];
  private nextId = 1;

  async findAll(userId: string, limit: number, cursor?: string): Promise<PaginatedMeals> {
    const owned = this.meals
      .filter((m) => m.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = cursor ? owned.findIndex((m) => m.id === cursor) + 1 : 0;
    const page = owned.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < owned.length;

    return {
      items: page,
      nextCursor: hasMore ? page[page.length - 1].id : null,
    };
  }

  async findByDateRange(userId: string, start: Date, end: Date): Promise<Meal[]> {
    return this.meals.filter(
      (m) => m.userId === userId && m.createdAt >= start && m.createdAt <= end
    );
  }

  async sumByDateRange(userId: string, start: Date, end: Date): Promise<MealTotals> {
    const inRange = await this.findByDateRange(userId, start, end);
    return inRange.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  async create(userId: string, data: CreateMealData): Promise<Meal> {
    const meal: Meal = {
      id: String(this.nextId++),
      createdAt: new Date(),
      userId,
      ...data,
    };
    this.meals.push(meal);
    return meal;
  }

  /** Test helper: seed a meal directly, bypassing create(), for setup. */
  seed(meal: Omit<Meal, 'id'> & { id?: string }): Meal {
    const full: Meal = { id: meal.id ?? String(this.nextId++), ...meal };
    this.meals.push(full);
    return full;
  }
}
