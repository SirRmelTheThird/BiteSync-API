import { PrismaMealRepository } from '../repositories/meal.repository';
import { MealsService } from './meals.service';

/**
 * One place that wires the concrete Prisma repository into the service.
 * Deliberately not a full DI framework/container — that would be
 * overengineering (violates YAGNI) for an app this size. A single factory
 * function is enough to get the testability benefit of Dependency
 * Inversion without adding a framework to learn.
 */
export function createMealsService(): MealsService {
  return new MealsService(new PrismaMealRepository());
}
