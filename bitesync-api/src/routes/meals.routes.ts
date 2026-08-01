import { Router } from 'express';
import * as mealsController from '../controllers/meals.controller';

const router = Router();

router.get('/', mealsController.listMeals);
router.post('/', mealsController.addMeal);
router.get('/summary', mealsController.dailySummary);

export default router;
