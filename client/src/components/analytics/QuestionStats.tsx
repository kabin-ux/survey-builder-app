import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Question, QuestionAnalytics } from '../../types/index';

interface QuestionStatsProps {
  question: Question;
  stats: QuestionAnalytics | undefined;
}

function QuestionStats({ question, stats }: QuestionStatsProps): React.ReactElement | null {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!stats) {
    return null;
  }

  const renderContent = () => {
    switch (question.type) {
      case 'text': {
        const responses = stats.responses || [];
        const totalPages = Math.ceil(responses.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedResponses = responses.slice(start, start + itemsPerPage);

        return (
          <div>
            <p className="text-slate-600 mb-4">
              {responses.length} response{responses.length !== 1 ? 's' : ''}
            </p>
            {responses.length === 0 ? (
              <p className="text-slate-500">No responses yet</p>
            ) : (
              <>
                <div className="space-y-2">
                  {paginatedResponses.map((response, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="text-slate-700">{response}</p>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-slate-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      }

      case 'multiple_choice':
      case 'checkbox': {
        const chartData = stats.options || [];
        const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="option" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" fill="#4f46e5">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4">
              {chartData.map((option) => (
                <div key={option.option} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">{option.option}</p>
                  <p className="text-slate-600">
                    {option.count} response{option.count !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'rating': {
        const distribution = stats.distribution || {};
        const chartData = Object.entries(distribution).map(([star, count]) => ({
          star: `${star} ⭐`,
          count
        }));

        return (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <p className="text-indigo-600 text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-indigo-700">
                {stats.average} / 5
              </p>
              <p className="text-sm text-indigo-600">
                Based on {stats.totalRatings} rating{stats.totalRatings !== 1 ? 's' : ''}
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="star" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3 className="text-base font-semibold text-slate-900 leading-snug flex-1">
          {question.text}
        </h3>
        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium capitalize">
          {question.type.replace(/[_-]/g, ' ')}
        </span>
      </div>
      {renderContent()}
    </div>
  );
}

export default QuestionStats;
