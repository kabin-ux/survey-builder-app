import React from 'react';
import { Link } from 'react-router-dom';
import { Survey } from '../../types/index';

interface SurveyListProps {
  surveys: Survey[];
  onDelete: (id: string) => Promise<void>;
}

function SurveyList({ surveys, onDelete }: SurveyListProps): React.ReactElement {
  return (
    <div>
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{surveys.length}</span>{' '}
          {surveys.length === 1 ? 'survey' : 'surveys'} total
        </p>
        <Link
          to="/admin/create"
          state={{ mode: 'create' }}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Survey
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">No surveys yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
            Get started by creating your first survey to collect responses from your audience.
          </p>
          <Link
            to="/admin/create"
            state={{ mode: 'create' }}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Create your first survey
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Questions</th>
                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {surveys.map((survey) => (
                <tr key={survey._id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{survey.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 line-clamp-1 max-w-xs">
                      {survey.description || <span className="text-slate-400 italic">No description</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${survey.isActive
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-slate-50 text-slate-600 ring-slate-500/20'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${survey.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {survey.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold tabular-nums">
                      {survey.questions.length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/edit/${survey._id}`}
                        state={{ mode: 'edit' }}
                        className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(survey._id)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SurveyList;
