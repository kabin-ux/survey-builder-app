import { Request, Response as ExpressResponse } from 'express';
import crypto from 'crypto';
import ResponseModel, { IResponse } from '../models/Response.js';
import Survey, { ISurvey } from '../models/Survey.js';

const getIpHash = (ip: string): string => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};

export const submitResponse = async (req: Request, res: ExpressResponse) => {
  try {
    const survey: ISurvey | null = await Survey.findById(req.params.surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress || '0.0.0.0';
    const ipHash = getIpHash(ipAddress as string);

    const response = new ResponseModel({
      surveyId: req.params.surveyId,
      answers: req.body.answers,
      ipHash
    });

    const savedResponse: IResponse = await response.save();
    res.status(201).json(savedResponse);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getResponses = async (req: Request, res: ExpressResponse) => {
  try {
    const responses: IResponse[] = await ResponseModel.find({
      surveyId: req.params.surveyId
    }).sort({
      createdAt: -1
    });
    res.json(responses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
