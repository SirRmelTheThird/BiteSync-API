import type { Meal } from '@prisma/client';
import { prisma } from '../prisma/client';

export type CreateMealData = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type PaginatedMeals = {
  items: Meal[];
  nextCursor: string | null;
};

export interface IMealRepository {
  findAll(userId: string, limit: number, cursor?: string): Promise<PaginatedMeals>;
  findByDateRange(userId: string, start: Date, end: Date): Promise<Meal[]>;
  sumByDateRange(userId: string, start: Date, end: Date): Promise<MealTotals>;
  create(userId: string, data: CreateMealData): Promise<Meal>;
}

export class PrismaMealRepository implements IMealRepository {
  async findAll(userId: string, limit: number, cursor?: string): Promise<PaginatedMeals> {
    const items = await prisma.meal.findMany({
      where: { userId },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });

    const hasMore = items.length > limit;
    const page = hasMore ? items.slice(0, limit) : items;

    return {
      items: page,
      nextCursor: hasMore ? page[page.length - 1].id : null,
    };
  }

  findByDateRange(userId: string, start: Date, end: Date): Promise<Meal[]> {
    return prisma.meal.findMany({
      where: { userId, createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sumByDateRange(userId: string, start: Date, end: Date): Promise<MealTotals> {
    // Aggregation happens in Postgres, not in Node. Instead of pulling
    // every row for the day over the network and reducing in JS (O(n)
    // transfer + memory), we ask the database for four numbers.
    const result = await prisma.meal.aggregate({
      where: { userId, createdAt: { gte: start, lte: end } },
      _sum: { calories: true, protein: true, carbs: true, fat: true },
    });

    return {
      calories: result._sum.calories ?? 0,
      protein: result._sum.protein ?? 0,
      carbs: result._sum.carbs ?? 0,
      fat: result._sum.fat ?? 0,
    };
  }

  create(userId: string, data: CreateMealData): Promise<Meal> {
    return prisma.meal.create({ data: { ...data, userId } });
  }
}
