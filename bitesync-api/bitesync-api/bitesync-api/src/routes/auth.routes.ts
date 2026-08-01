import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// authLimiter (not generalLimiter) applies here — these are the endpoints
// most worth protecting against brute force.
router.post('/register', authLimiter, asyncHandler(authController.register));
router.post('/login', authLimiter, asyncHandler(authController.login));

export default router;
