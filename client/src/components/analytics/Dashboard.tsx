import React from 'react';
import { Survey, AnalyticsData } from '../../types/index';
import QuestionStats from './QuestionStats';

interface DashboardProps {
  survey: Survey;
  analytics: AnalyticsData;
}

function Dashboard({ survey, analytics }: DashboardProps): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">High-level metrics for this survey.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Responses */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Responses
              </p>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center ring-1 ring-inset ring-indigo-600/10">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {analytics.totalResponses.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              {analytics.totalResponses === 0 ? 'No responses yet' : 'Across all questions'}
            </p>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Questions
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center ring-1 ring-inset ring-emerald-600/10">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {survey.questions.length}
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              {survey.questions.length === 1 ? 'Question in survey' : 'Questions in survey'}
            </p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Completion Rate
              </p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center ring-1 ring-inset ring-amber-600/10">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {analytics.totalResponses > 0 ? '100%' : <span className="text-slate-300">—</span>}
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              {analytics.totalResponses > 0 ? 'All responses complete' : 'Awaiting data'}
            </p>
          </div>
        </div>
      </div>

      {/* Question Results */}
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Question Results</h2>
            <p className="text-xs text-slate-500 mt-0.5">Breakdown of responses for each question.</p>
          </div>
          {analytics.totalResponses > 0 && (
            <p className="text-xs text-slate-500">
              Based on{' '}
              <span className="font-semibold text-slate-700 tabular-nums">
                {analytics.totalResponses.toLocaleString()}
              </span>{' '}
              {analytics.totalResponses === 1 ? 'response' : 'responses'}
            </p>
          )}
        </div>

        {analytics.totalResponses === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No responses yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Once respondents begin submitting answers, you'll see results here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {survey.questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Question {index + 1} of {survey.questions.length}
                  </span>
                </div>
                <QuestionStats
                  question={question}
                  stats={analytics.questions[question.id]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
