import { describe, expect, it } from 'vitest';
import { MealsService } from '../meals.service';
import { FakeMealRepository } from '../../repositories/__tests__/fakes/FakeMealRepository';
import { AppError } from '../../utils/AppError';

const USER_A = 'user-a';
const USER_B = 'user-b';

function setup() {
  const repository = new FakeMealRepository();
  const service = new MealsService(repository);
  return { repository, service };
}

describe('MealsService', () => {
  it('creates a meal scoped to the given user', async () => {
    const { service } = setup();

    const meal = await service.createMeal(USER_A, {
      name: 'Chicken & Rice',
      calories: 540,
      protein: 45,
      carbs: 50,
      fat: 12,
    });

    expect(meal.userId).toBe(USER_A);
    expect(meal.name).toBe('Chicken & Rice');
  });

  it('never returns another user\'s meals', async () => {
    const { service } = setup();

    await service.createMeal(USER_A, { name: 'A meal', calories: 100, protein: 10, carbs: 10, fat: 1 });
    await service.createMeal(USER_B, { name: 'B meal', calories: 200, protein: 20, carbs: 20, fat: 2 });

    const { items } = await service.getAllMeals(USER_A, 20);

    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('A meal');
  });

  it('paginates results and returns a nextCursor when more remain', async () => {
    const { service } = setup();

    for (let i = 0; i < 5; i++) {
      await service.createMeal(USER_A, { name: `Meal ${i}`, calories: 100, protein: 1, carbs: 1, fat: 1 });
    }

    const firstPage = await service.getAllMeals(USER_A, 2);
    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.nextCursor).not.toBeNull();

    const secondPage = await service.getAllMeals(USER_A, 2, firstPage.nextCursor!);
    expect(secondPage.items).toHaveLength(2);
  });

  it('sums calories/protein/carbs/fat for a given day via the repository, not in-memory reduce', async () => {
    const { repository, service } = setup();

    const today = new Date();
    repository.seed({
      userId: USER_A,
      name: 'Breakfast',
      calories: 300,
      protein: 20,
      carbs: 30,
      fat: 10,
      createdAt: today,
    });
    repository.seed({
      userId: USER_A,
      name: 'Lunch',
      calories: 500,
      protein: 40,
      carbs: 50,
      fat: 15,
      createdAt: today,
    });

    const dateStr = today.toISOString().slice(0, 10);
    const summary = await service.getDailySummary(USER_A, dateStr);

    expect(summary).toEqual({ calories: 800, protein: 60, carbs: 80, fat: 25 });
  });

  it('excludes meals from other users in the daily summary', async () => {
    const { repository, service } = setup();
    const today = new Date();

    repository.seed({ userId: USER_A, name: 'A', calories: 100, protein: 1, carbs: 1, fat: 1, createdAt: today });
    repository.seed({ userId: USER_B, name: 'B', calories: 900, protein: 9, carbs: 9, fat: 9, createdAt: today });

    const dateStr = today.toISOString().slice(0, 10);
    const summary = await service.getDailySummary(USER_A, dateStr);

    expect(summary.calories).toBe(100);
  });

  it('throws a 400 AppError for a malformed date', async () => {
    const { service } = setup();

    await expect(service.getDailySummary(USER_A, 'not-a-date')).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(service.getDailySummary(USER_A, 'not-a-date')).rejects.toBeInstanceOf(AppError);
  });
});
