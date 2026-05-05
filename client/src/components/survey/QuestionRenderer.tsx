import React from 'react';
import { Question } from '../../types/index';

interface QuestionRendererProps {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
}

function QuestionRenderer({
  question,
  value,
  onChange
}: QuestionRendererProps): React.ReactElement {
  switch (question.type) {
    case 'text':
      return (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer..."
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        />
      );

    case 'multiple_choice':
      return (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={(value as string[])?.includes(option) || false}
                onChange={(e) => {
                  const current = (value as string[]) || [];
                  if (e.target.checked) {
                    onChange([...current, option]);
                  } else {
                    onChange(current.filter((v) => v !== option));
                  }
                }}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'rating':
      return (
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`w-12 h-12 rounded-lg border-2 font-semibold text-lg transition ${
                value === star
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
            >
              {star}
            </button>
          ))}
        </div>
      );

    default:
      return <div>Unknown question type</div>;
  }
}

export default QuestionRenderer;
