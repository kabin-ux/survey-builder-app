import express, { Router } from 'express';
import { body } from 'express-validator';
import { handleValidationError } from '../middlewares/validation.js';
import { saveDraft, getDraft, deleteDraft } from '../controllers/draftController.js';

const router: Router = express.Router({ mergeParams: true });

router.post(
  '/',
  body('answers').isArray(),
  handleValidationError,
  saveDraft
);

router.get('/', getDraft);

router.delete('/', deleteDraft);

export default router;
