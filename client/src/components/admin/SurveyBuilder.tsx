import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { surveyApi } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import { Survey, Question, FormDataState } from '../../types/index';
import QuestionBuilder from './QuestionBuilder';

interface SurveyBuilderProps {
  survey?: Survey | null;
  onSurveyCreated?: () => void;
  onSurveyUpdated?: () => void;
}

function SurveyBuilder({
  survey = null,
  onSurveyCreated,
  onSurveyUpdated
}: SurveyBuilderProps): React.ReactElement {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    questions: []
  });

  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title,
        description: survey.description || '',
        questions: survey.questions
      });
    }
  }, [survey]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setFormData({ ...formData, description: e.target.value });
  };

  const addQuestion = (): void => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      text: '',
      required: false,
      options: [],
      conditionalLogic: {},
      order: formData.questions.length
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const removeQuestion = (questionId: string): void => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((q) => q.id !== questionId)
    });
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>): void => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down'): void => {
    const index = formData.questions.findIndex((q) => q.id === questionId);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < formData.questions.length - 1)
    ) {
      const newQuestions = [...formData.questions];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newQuestions[index], newQuestions[swapIndex]] = [
        newQuestions[swapIndex],
        newQuestions[index]
      ];
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Survey title is required');
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }

    try {
      if (survey) {
        await surveyApi.updateSurvey(survey._id, formData);
        onSurveyUpdated?.();
      } else {
        await surveyApi.createSurvey(formData);
        onSurveyCreated?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save survey');
    }
  };

  return (
    <div>
      {/* Survey Details Section */}
      <div className="px-6 py-6 border-b border-slate-200">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-900">Survey Details</h3>
          <p className="text-xs text-slate-500 mt-0.5">Basic information shown to respondents.</p>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Customer Satisfaction Q1 2026"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="A short description shown to respondents"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="px-6 py-6 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Questions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {formData.questions.length === 0
                ? 'Add questions to your survey.'
                : `${formData.questions.length} question${formData.questions.length === 1 ? '' : 's'} added.`}
            </p>
          </div>
          <button
            onClick={addQuestion}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm shrink-0"
          >
            Add Question
          </button>
        </div>

        {formData.questions.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl px-6 py-12 text-center">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">No questions yet</p>
            <p className="text-xs text-slate-500 mb-4">Add your first question to get started.</p>
            <button
              onClick={addQuestion}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              + Add Question
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.questions.map((question, index) => (
              <div
                key={question.id}
                className="flex gap-3 items-start"
              >
                <div className="shrink-0 mt-3 w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center tabular-nums">
                  {index + 1}
                </div>
                <div className="flex-1 border border-slate-200 rounded-xl bg-white p-4 hover:border-slate-300 transition-colors">
                  <QuestionBuilder
                    question={question}
                    allQuestions={formData.questions}
                    onUpdate={(updates) => updateQuestion(question.id, updates)}
                    onRemove={() => removeQuestion(question.id)}
                    onMoveUp={() => moveQuestion(question.id, 'up')}
                    onMoveDown={() => moveQuestion(question.id, 'down')}
                    canMoveUp={index > 0}
                    canMoveDown={index < formData.questions.length - 1}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50/60 flex items-center justify-end gap-2">
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          {survey ? 'Save changes' : 'Create survey'}
        </button>
      </div>
    </div>
  );
}

export default SurveyBuilder;
