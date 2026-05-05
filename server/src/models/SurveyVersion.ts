import mongoose, { Document, Schema } from 'mongoose';
import { Question } from './Survey.js';

export interface ISurveyVersion extends Document {
  surveyId: mongoose.Types.ObjectId;
  version: number;
  title: string;
  description?: string;
  questions: Question[];
  changedBy: string; // user ID
  changeDescription?: string;
  createdAt: Date;
}

const questionSchema = new Schema(
  {
    id: String,
    type: String,
    text: String,
    required: Boolean,
    options: [String],
    conditionalLogic: {
      dependsOn: String,
      showWhen: String
    },
    order: Number
  },
  { _id: false }
);

const surveyVersionSchema = new Schema<ISurveyVersion>(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: true
    },
    version: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    questions: [questionSchema],
    changedBy: {
      type: String,
      required: true
    },
    changeDescription: String
  },
  {
    timestamps: true
  }
);

// Compound index to ensure unique versions per survey
surveyVersionSchema.index({ surveyId: 1, version: 1 }, { unique: true });

const SurveyVersion = mongoose.model<ISurveyVersion>('SurveyVersion', surveyVersionSchema);

export default SurveyVersion;
