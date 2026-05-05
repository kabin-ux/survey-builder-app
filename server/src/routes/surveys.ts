import express from 'express';
import { body, param } from 'express-validator';
import { handleValidationError } from '../middlewares/validation.js';
import {
  getAllSurveys,
  createSurvey,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  getSurveyVersions,
  restoreSurveyVersion
} from '../controllers/surveyController.js';

const router = express.Router();

router.get('/', getAllSurveys);

router.post(
  '/',
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().optional(),
  handleValidationError,
  createSurvey
);

router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid survey ID'),
  handleValidationError,
  getSurveyById
);

router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid survey ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  handleValidationError,
  updateSurvey
);

router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid survey ID'),
  handleValidationError,
  deleteSurvey
);

// Version endpoints
router.get(
  '/:id/versions',
  param('id').isMongoId().withMessage('Invalid survey ID'),
  handleValidationError,
  getSurveyVersions
);

router.post(
  '/:surveyId/versions/:versionId/restore',
  param('surveyId').isMongoId().withMessage('Invalid survey ID'),
  param('versionId').isMongoId().withMessage('Invalid version ID'),
  handleValidationError,
  restoreSurveyVersion
);

export default router;
