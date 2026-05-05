import { Request, Response } from 'express';
import Survey, { ISurvey } from '../models/Survey.js';
import SurveyVersion from '../models/SurveyVersion.js';

export const getAllSurveys = async (req: Request, res: Response) => {
  try {
    const surveys: ISurvey[] = await Survey.find().sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSurvey = async (req: Request, res: Response) => {
  try {
    const survey = new Survey({
      title: req.body.title,
      description: req.body.description || '',
      questions: req.body.questions || [],
      isActive: true
    });
    const savedSurvey: ISurvey = await survey.save();
    res.status(201).json(savedSurvey);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSurveyById = async (req: Request, res: Response) => {
  try {
    const survey: ISurvey | null = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSurvey = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const survey: ISurvey | null = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Create version before update
    const lastVersion = await SurveyVersion.findOne({ surveyId: req.params.id })
      .sort({ version: -1 });
    const nextVersion = (lastVersion?.version || 0) + 1;

    await new SurveyVersion({
      surveyId: req.params.id,
      version: nextVersion,
      title: survey.title,
      description: survey.description,
      questions: survey.questions,
      changedBy: req.userId || 'anonymous',
      changeDescription: req.body.changeDescription
    }).save();

    // Update survey
    const updated: ISurvey | null = await Survey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSurvey = async (req: Request, res: Response) => {
  try {
    const survey: ISurvey | null = await Survey.findByIdAndDelete(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json({ message: 'Survey deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSurveyVersions = async (req: Request, res: Response) => {
  try {
    const versions = await SurveyVersion.find({ surveyId: req.params.id })
      .sort({ version: -1 });

    if (versions.length === 0) {
      return res.status(404).json({ message: 'No versions found' });
    }

    res.json(versions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreSurveyVersion = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const { surveyId, versionId } = req.params;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const versionToRestore = await SurveyVersion.findById(versionId);
    if (!versionToRestore) {
      return res.status(404).json({ message: 'Version not found' });
    }

    // Create version before restore
    const lastVersion = await SurveyVersion.findOne({ surveyId })
      .sort({ version: -1 });
    const nextVersion = (lastVersion?.version || 0) + 1;

    await new SurveyVersion({
      surveyId,
      version: nextVersion,
      title: survey.title,
      description: survey.description,
      questions: survey.questions,
      changedBy: req.userId || 'anonymous',
      changeDescription: `Restored from version ${versionToRestore.version}`
    }).save();

    // Restore survey
    const restored = await Survey.findByIdAndUpdate(
      surveyId,
      {
        title: versionToRestore.title,
        description: versionToRestore.description,
        questions: versionToRestore.questions
      },
      { new: true }
    );

    res.json({
      message: `Restored to version ${versionToRestore.version}`,
      survey: restored
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
