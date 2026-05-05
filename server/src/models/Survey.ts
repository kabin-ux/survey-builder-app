import mongoose, { Document, Schema } from 'mongoose';

export interface ConditionalLogic {
  dependsOn?: string;
  showWhen?: string;
}

export interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'rating';
  text: string;
  required: boolean;
  options: string[];
  conditionalLogic?: ConditionalLogic;
  order?: number;
}

export interface ISurvey extends Document {
  title: string;
  description?: string;
  isActive: boolean;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

const conditionalLogicSchema = new Schema<ConditionalLogic>(
  {
    dependsOn: String,
    showWhen: String
  },
  { _id: false }
);

const questionSchema = new Schema<Question>(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['text', 'multiple_choice', 'checkbox', 'rating'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [String],
    conditionalLogic: conditionalLogicSchema,
    order: Number
  },
  { _id: false }
);

const surveySchema = new Schema<ISurvey>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

const Survey = mongoose.model<ISurvey>('Survey', surveySchema);

export default Survey;
