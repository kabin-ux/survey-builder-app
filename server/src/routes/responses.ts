import express from 'express';
import { param, body } from 'express-validator';
import { handleValidationError } from '../middlewares/validation.js';
import { submitResponse, getResponses } from '../controllers/responseController.js';

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  param('surveyId').isMongoId().withMessage('Invalid survey ID'),
  body('answers').isArray().notEmpty().withMessage('Answers are required'),
  handleValidationError,
  submitResponse
);

router.get(
  '/',
  param('surveyId').isMongoId().withMessage('Invalid survey ID'),
  handleValidationError,
  getResponses
);

export default router;
