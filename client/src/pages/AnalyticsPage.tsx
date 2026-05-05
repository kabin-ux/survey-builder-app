import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyApi, analyticsApi } from '../services/api';
import toast from 'react-hot-toast';
import { Survey, AnalyticsData } from '../types/index';
import Dashboard from '../components/analytics/Dashboard';

function AnalyticsPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async (): Promise<void> => {
    try {
      const [surveyRes, analyticsRes] = await Promise.all([
        surveyApi.getSurveyById(id!),
        analyticsApi.getAnalytics(id!)
      ]);
      setSurvey(surveyRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      toast.error('Failed to load analytics');
      navigate('/');
    } finally {
      setLoading(false);
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
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!survey || !analytics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 font-medium">Analytics not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div>
            <h1 className="text-sm font-semibold text-slate-900">Analytics</h1>
            <p className="text-xs text-slate-500">{survey.title}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Dashboard survey={survey} analytics={analytics} />
      </div>
    </div>
  );
}

export default AnalyticsPage;
