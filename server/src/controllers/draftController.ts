import { Request, Response } from 'express';
import crypto from 'crypto';
import DraftResponse from '../models/DraftResponse.js';
import Survey from '../models/Survey.js';

const getIpHash = (ip: string): string => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};

export const saveDraft = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { surveyId } = req.params;
    const { answers } = req.body;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }

    const ipAddress = req.ip || req.connection.remoteAddress || '0.0.0.0';
    const ipHash = getIpHash(ipAddress as string);

    // Find existing draft
    let draft;
    if (req.userId) {
      draft = await DraftResponse.findOne({ surveyId, userId: req.userId });
    } else {
      draft = await DraftResponse.findOne({ surveyId, ipHash });
    }

    if (draft) {
      // Update existing draft
      draft.answers = answers;
      draft.lastSavedAt = new Date();
      await draft.save();
    } else {
      // Create new draft
      draft = new DraftResponse({
        surveyId,
        userId: req.userId,
        ipHash: !req.userId ? ipHash : undefined,
        answers
      });
      await draft.save();
    }

    res.json({
      message: 'Draft saved successfully',
      draft: {
        id: draft._id,
        lastSavedAt: draft.lastSavedAt,
        answers: draft.answers
      }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDraft = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { surveyId } = req.params;

    const ipAddress = req.ip || req.connection.remoteAddress || '0.0.0.0';
    const ipHash = getIpHash(ipAddress as string);

    let draft;
    if (req.userId) {
      draft = await DraftResponse.findOne({ surveyId, userId: req.userId });
    } else {
      draft = await DraftResponse.findOne({ surveyId, ipHash });
    }

    if (!draft) {
      res.status(404).json({ message: 'No draft found' });
      return;
    }

    res.json({
      draft: {
        id: draft._id,
        answers: draft.answers,
        lastSavedAt: draft.lastSavedAt
      }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDraft = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { surveyId } = req.params;

    const ipAddress = req.ip || req.connection.remoteAddress || '0.0.0.0';
    const ipHash = getIpHash(ipAddress as string);

    let result;
    if (req.userId) {
      result = await DraftResponse.deleteOne({ surveyId, userId: req.userId });
    } else {
      result = await DraftResponse.deleteOne({ surveyId, ipHash });
    }

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Draft not found' });
      return;
    }

    res.json({ message: 'Draft deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
