import mongoose, { Document, Schema } from 'mongoose';

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface IResponse extends Document {
  surveyId: mongoose.Types.ObjectId;
  answers: Answer[];
  ipHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<Answer>(
  {
    questionId: {
      type: String,
      required: true
    },
    value: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const responseSchema = new Schema<IResponse>(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: true
    },
    answers: [answerSchema],
    ipHash: String
  },
  {
    timestamps: true
  }
);

const Response = mongoose.model<IResponse>('Response', responseSchema);

export default Response;
