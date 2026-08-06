import { Router } from 'express';
import * as mealsController from '../controllers/meals.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', asyncHandler(mealsController.listMeals));
router.post('/', asyncHandler(mealsController.addMeal));
router.get('/summary', asyncHandler(mealsController.dailySummary));

export default router;
