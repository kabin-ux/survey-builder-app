import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Survey, Answer } from '../../types/index';
import { draftApi } from '../../services/api';
import QuestionRenderer from './QuestionRenderer';

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (answers: Answer[]) => Promise<void>;
}

function SurveyForm({ survey, onSubmit }: SurveyFormProps): React.ReactElement {
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] | number }>({});
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async (): Promise<void> => {
      try {
        const response = await draftApi.getDraft(survey._id);
        if (response.data.draft.answers.length > 0) {
          const draftAnswers: { [key: string]: string | string[] | number } = {};
          response.data.draft.answers.forEach((answer) => {
            draftAnswers[answer.questionId] = answer.value;
          });
          setAnswers(draftAnswers);
          setLastSaved(new Date(response.data.draft.lastSavedAt).toLocaleTimeString());
          toast.success('Draft loaded!');
        }
      } catch (error) {
        // No draft found, that's okay
      }
    };

    loadDraft();
  }, [survey._id]);

  const updateAnswer = (questionId: string, value: string | string[] | number): void => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const saveDraft = async (): Promise<void> => {
    try {
      setSaving(true);
      const visibleQuestions = getVisibleQuestions();
      const draftAnswers: Answer[] = visibleQuestions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] || ''
      }));

      await draftApi.saveDraft(survey._id, draftAnswers);
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
      toast.success('Draft saved!');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const shouldShowQuestion = (question: any): boolean => {
    if (!question.conditionalLogic?.dependsOn) {
      return true;
    }

    const dependsOnQuestionId = question.conditionalLogic.dependsOn;
    const dependsOnAnswer = answers[dependsOnQuestionId];
    const showWhen = question.conditionalLogic.showWhen;

    if (Array.isArray(dependsOnAnswer)) {
      return dependsOnAnswer.includes(showWhen);
    }
    return dependsOnAnswer === showWhen;
  };

  const getVisibleQuestions = () => {
    return survey.questions.filter(shouldShowQuestion);
  };

  const validateAnswers = (): boolean => {
    const visibleQuestions = getVisibleQuestions();
    for (const question of visibleQuestions) {
      if (question.required) {
        const answer = answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          toast.error(`${question.text} is required`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateAnswers()) {
      return;
    }

    const visibleQuestions = getVisibleQuestions();
    const submissionAnswers: Answer[] = visibleQuestions.map((q) => ({
      questionId: q.id,
      value: answers[q.id] || ''
    }));

    setSubmitting(true);
    try {
      await onSubmit(submissionAnswers);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {getVisibleQuestions().map((question, index) => (
        <div key={question.id} className="bg-white rounded-xl border border-slate-200 p-6">
          <label className="block text-base font-semibold text-slate-900 mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold mr-3">
              {index + 1}
            </span>
            {question.text}
            {question.required && <span className="text-red-500 ml-1.5">*</span>}
          </label>

          <QuestionRenderer
            question={question}
            value={answers[question.id]}
            onChange={(value) => updateAnswer(question.id, value)}
          />
        </div>
      ))}

      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sticky bottom-0">
        <div className="flex-1">
          {lastSaved && (
            <p className="text-xs text-slate-500">
              💾 Auto-saved at {lastSaved}
            </p>
          )}
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-900 px-4 py-2.5 rounded-lg font-semibold transition-colors"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Draft
              </>
            )}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SurveyForm;
