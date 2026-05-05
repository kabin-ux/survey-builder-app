import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { surveyApi } from '../services/api';
import toast from 'react-hot-toast';
import { Survey } from '../types/index';
import SurveyList from '../components/admin/SurveyList';
import SurveyBuilder from '../components/admin/SurveyBuilder';

interface LocationState {
  mode?: 'list' | 'create' | 'edit';
}

function AdminPage({ mode }: { mode?: 'list' | 'create' | 'edit' }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const pageMode = mode || (location.state as LocationState)?.mode || 'list';

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageMode === 'list') {
      fetchSurveys();
    } else if (id && pageMode === 'edit') {
      fetchSurveyById(id);
    }
    setLoading(false);
  }, [pageMode, id]);

  const fetchSurveys = async (): Promise<void> => {
    try {
      const response = await surveyApi.getAllSurveys();
      setSurveys(response.data);
    } catch (error) {
      toast.error('Failed to fetch surveys');
      console.error(error);
    }
  };

  const fetchSurveyById = async (surveyId: string): Promise<void> => {
    try {
      const response = await surveyApi.getSurveyById(surveyId);
      setSelectedSurvey(response.data);
    } catch (error) {
      toast.error('Failed to load survey');
      navigate('/admin');
    }
  };

  const handleSurveyCreated = (): void => {
    fetchSurveys();
    navigate('/admin');
    toast.success('Survey created successfully!');
  };

  const handleSurveyUpdated = (): void => {
    fetchSurveys();
    navigate('/admin');
    toast.success('Survey updated successfully!');
  };

  const handleDelete = async (surveyId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await surveyApi.deleteSurvey(surveyId);
        toast.success('Survey deleted');
        fetchSurveys();
      } catch (error) {
        toast.error('Failed to delete survey');
      }
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
          <p className="text-slate-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-8xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              A
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">Survey Management</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
            <span>Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">Surveys</span>
            {pageMode !== 'list' && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 capitalize">{pageMode}</span>
              </>
            )}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            {pageMode === 'list'
              ? 'Surveys'
              : pageMode === 'create'
                ? 'Create Survey'
                : 'Edit Survey'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {pageMode === 'list'
              ? 'Manage, review, and organize all your surveys in one place.'
              : pageMode === 'create'
                ? 'Build a new survey from scratch with custom questions.'
                : 'Update questions and settings for your existing survey.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {pageMode === 'list' ? (
            <SurveyList surveys={surveys} onDelete={handleDelete} />
          ) : pageMode === 'create' ? (
            <SurveyBuilder onSurveyCreated={handleSurveyCreated} />
          ) : (
            <SurveyBuilder
              survey={selectedSurvey}
              onSurveyUpdated={handleSurveyUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
