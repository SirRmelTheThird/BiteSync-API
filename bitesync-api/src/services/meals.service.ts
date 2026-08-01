import { prisma } from '../prisma/client';

export type CreateMealInput = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function getAllMeals() {
  return prisma.meal.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export function getMealsByDate(date: string) {
  // date expected as "YYYY-MM-DD"
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  return prisma.meal.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export function createMeal(data: CreateMealInput) {
  return prisma.meal.create({ data });
}

export async function getDailySummary(date: string) {
  const meals = await getMealsByDate(date);

  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}
