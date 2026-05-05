import mongoose, { Document, Schema } from 'mongoose';
import { Answer } from './Response.js';

export interface IDraftResponse extends Document {
  surveyId: mongoose.Types.ObjectId;
  userId?: string; // optional - can save anonymously
  ipHash?: string; // for anonymous users
  answers: Answer[];
  lastSavedAt: Date;
  expiresAt: Date; // Auto-delete after 30 days
}

const answerSchema = new Schema(
  {
    questionId: String,
    value: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const draftResponseSchema = new Schema<IDraftResponse>(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: true
    },
    userId: String,
    ipHash: String,
    answers: [answerSchema],
    lastSavedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  },
  {
    timestamps: true
  }
);

// TTL index to auto-delete expired drafts
draftResponseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create compound index for fast lookups
draftResponseSchema.index({ surveyId: 1, userId: 1 }, { sparse: true });
draftResponseSchema.index({ surveyId: 1, ipHash: 1 }, { sparse: true });

const DraftResponse = mongoose.model<IDraftResponse>('DraftResponse', draftResponseSchema);

export default DraftResponse;
