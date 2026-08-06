import { PrismaMealRepository } from '../repositories/meal.repository';
import { MealsService } from './meals.service';

export function createMealsService(): MealsService {
  return new MealsService(new PrismaMealRepository());
}
