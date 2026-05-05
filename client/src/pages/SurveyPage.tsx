import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyApi, responseApi } from '../services/api';
import toast from 'react-hot-toast';
import { Survey, Answer } from '../types/index';
import SurveyForm from '../components/survey/SurveyForm';

function SurveyPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async (): Promise<void> => {
    try {
      const response = await surveyApi.getSurveyById(id!);
      if (!response.data.isActive) {
        toast.error('This survey is not active');
        navigate('/');
        return;
      }
      setSurvey(response.data);
    } catch (error) {
      toast.error('Survey not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answers: Answer[]): Promise<void> => {
    try {
      await responseApi.submitResponse(id!, { answers });
      setSubmitted(true);
      toast.success('Thank you for completing the survey!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit survey');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 font-medium">Survey not found</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Thank you!</h2>
            <p className="text-slate-600 mb-6">Your response has been recorded successfully.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-semibold transition-colors"
            >
              Back to surveys
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex justify-between items-center">
          <div>
            <h1 className="text-sm font-semibold text-slate-900">Survey</h1>
            <p className="text-xs text-slate-500">{survey.title}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Exit
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Survey Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">{survey.title}</h2>
          {survey.description && (
            <p className="text-slate-600 leading-relaxed">{survey.description}</p>
          )}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Survey Form */}
        <SurveyForm survey={survey} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default SurveyPage;
