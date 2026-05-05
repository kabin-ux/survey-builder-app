import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import surveyRoutes from './routes/surveys.js';
import responseRoutes from './routes/responses.js';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import draftRoutes from './routes/drafts.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per IP
  message: 'Too many survey submissions, please try again later'
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/survey-builder')
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/surveys/:surveyId/responses', submitLimiter, responseRoutes);
app.use('/api/surveys/:surveyId/analytics', analyticsRoutes);
app.use('/api/surveys/:surveyId/drafts', draftRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
