import { Request, Response as ExpressResponse } from 'express';
import ResponseModel, { IResponse, Answer } from '../models/Response.js';
import Survey, { ISurvey, Question } from '../models/Survey.js';

interface OptionStats {
  option: string;
  count: number;
}

interface RatingDistribution {
  [key: number]: number;
}

interface QuestionAnalytics {
  id: string;
  type: string;
  text: string;
  responses?: string[];
  options?: OptionStats[];
  average?: number;
  distribution?: RatingDistribution;
  totalRatings?: number;
}

interface AnalyticsData {
  surveyId: string;
  totalResponses: number;
  questions: {
    [key: string]: QuestionAnalytics;
  };
}

export const getSurveyAnalytics = async (req: Request, res: ExpressResponse) => {
  try {
    const survey: ISurvey | null = await Survey.findById(req.params.surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const responses: IResponse[] = await ResponseModel.find({ surveyId: req.params.surveyId });
    const totalResponses = responses.length;

    const analytics: AnalyticsData = {
      surveyId: req.params.surveyId,
      totalResponses,
      questions: {}
    };

    survey.questions.forEach((question: Question) => {
      const questionAnalytics: QuestionAnalytics = {
        id: question.id,
        type: question.type,
        text: question.text
      };

      const answers: Answer[] = responses
        .map((r) => r.answers.find((a) => a.questionId === question.id))
        .filter(Boolean) as Answer[];

      switch (question.type) {
        case 'text':
          questionAnalytics.responses = answers.map((a) => String(a.value));
          break;

        case 'multiple_choice':
        case 'checkbox':
          const optionCounts: { [key: string]: number } = {};
          question.options.forEach((opt) => {
            optionCounts[opt] = 0;
          });
          answers.forEach((a) => {
            if (Array.isArray(a.value)) {
              a.value.forEach((v) => {
                if (optionCounts.hasOwnProperty(v)) optionCounts[v]++;
              });
            } else {
              if (optionCounts.hasOwnProperty(String(a.value)))
                optionCounts[String(a.value)]++;
            }
          });
          questionAnalytics.options = question.options.map((opt) => ({
            option: opt,
            count: optionCounts[opt]
          }));
          break;

        case 'rating':
          const ratings: number[] = answers
            .map((a) => parseInt(String(a.value)))
            .filter((v) => !isNaN(v));
          const sum = ratings.reduce((acc, val) => acc + val, 0);
          const average = ratings.length > 0 ? sum / ratings.length : 0;
          const distribution: RatingDistribution = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          };
          ratings.forEach((r) => {
            if (distribution.hasOwnProperty(r)) distribution[r]++;
          });
          questionAnalytics.average = parseFloat(average.toFixed(2));
          questionAnalytics.distribution = distribution;
          questionAnalytics.totalRatings = ratings.length;
          break;
      }

      analytics.questions[question.id] = questionAnalytics;
    });

    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
