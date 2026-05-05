import express from 'express';
import { param } from 'express-validator';
import { handleValidationError } from '../middlewares/validation.js';
import { getSurveyAnalytics } from '../controllers/analyticsController.js';

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  param('surveyId').isMongoId().withMessage('Invalid survey ID'),
  handleValidationError,
  getSurveyAnalytics
);

export default router;
