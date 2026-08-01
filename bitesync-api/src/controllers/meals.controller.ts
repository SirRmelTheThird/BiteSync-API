import type { Request, Response } from 'express';
import * as mealsService from '../services/meals.service';

export async function listMeals(req: Request, res: Response) {
  const { date } = req.query;

  const meals =
    typeof date === 'string'
      ? await mealsService.getMealsByDate(date)
      : await mealsService.getAllMeals();

  res.json(meals);
}

export async function addMeal(req: Request, res: Response) {
  const { name, calories, protein, carbs, fat } = req.body;

  if (
    typeof name !== 'string' ||
    typeof calories !== 'number' ||
    typeof protein !== 'number' ||
    typeof carbs !== 'number' ||
    typeof fat !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid meal payload' });
  }

  const meal = await mealsService.createMeal({
    name,
    calories,
    protein,
    carbs,
    fat,
  });

  res.status(201).json(meal);
}

export async function dailySummary(req: Request, res: Response) {
  const { date } = req.query;

  if (typeof date !== 'string') {
    return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' });
  }

  const summary = await mealsService.getDailySummary(date);
  res.json(summary);
}
