import { Router } from 'express';
import * as mealsController from '../controllers/meals.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// requireAuth applies to every meals route — there is no anonymous access
// to meal data.
router.use(requireAuth);

router.get('/', asyncHandler(mealsController.listMeals));
router.post('/', asyncHandler(mealsController.addMeal));
router.get('/summary', asyncHandler(mealsController.dailySummary));

export default router;
