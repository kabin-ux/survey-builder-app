import express, { Router } from 'express';
import { body } from 'express-validator';
import { handleValidationError } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import {
  register,
  login,
  getProfile
} from '../controllers/authController.js';

const router: Router = express.Router();

router.post(
  '/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  handleValidationError,
  register
);

router.post(
  '/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationError,
  login
);

router.get('/profile', authenticate, getProfile);

export default router;
