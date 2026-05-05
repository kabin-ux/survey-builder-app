import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { surveyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Survey } from '../types/index';

function Home(): React.ReactElement {
  const { isAuthenticated, user, logout } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async (): Promise<void> => {
    try {
      const response = await surveyApi.getAllSurveys();
      setSurveys(response.data.filter((s) => s.isActive));
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              S
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold text-slate-900">Survey Builder</h1>
              <p className="text-xs text-slate-500">Hosted surveys, simply.</p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 pr-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                </div>
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Admin Login
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Create Survey
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="max-w-2xl">
          {!loading && surveys.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium ring-1 ring-inset ring-indigo-600/10 mb-5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-indigo-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              </span>
              {surveys.length} active {surveys.length === 1 ? 'survey' : 'surveys'}
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
            Available surveys
          </h2>
          <p className="text-base text-slate-600 max-w-xl leading-relaxed">
            Browse open surveys and contribute your responses. Your input helps shape better products and decisions.
          </p>
        </div>
      </div>

      {/* Survey Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-5 bg-slate-200 rounded w-10"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-4/5 mb-6"></div>
                <div className="flex gap-2">
                  <div className="h-9 bg-slate-200 rounded flex-1"></div>
                  <div className="h-9 bg-slate-200 rounded w-28"></div>
                </div>
              </div>
            ))}
          </div>
        ) : surveys.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No surveys available</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              Check back later, or create your own to get started.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Create a survey
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                    {survey.title}
                  </h3>
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium tabular-nums">
                    {survey.questions?.length ?? 0} Q
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-1 leading-relaxed">
                  {survey.description || (
                    <span className="text-slate-400 italic">No description provided</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/survey/${survey._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
                  >
                    Take survey
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    to={`/analytics/${survey._id}`}
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                    aria-label="View analytics"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
