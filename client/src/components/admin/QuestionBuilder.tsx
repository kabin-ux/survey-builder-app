import React from 'react';
import { Question, ConditionalLogic } from '../../types/index';

interface QuestionBuilderProps {
  question: Question;
  allQuestions: Question[];
  onUpdate: (updates: Partial<Question>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function QuestionBuilder({
  question,
  allQuestions,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: QuestionBuilderProps): React.ReactElement {
  const handleTypeChange = (type: string): void => {
    const updates: Partial<Question> = { type: type as Question['type'] };
    if (type === 'text' || type === 'rating') {
      updates.options = [];
    }
    onUpdate(updates);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onUpdate({ text: e.target.value });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onUpdate({ required: e.target.checked });
  };

  const handleOptionChange = (index: number, value: string): void => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const addOption = (): void => {
    onUpdate({ options: [...question.options, ''] });
  };

  const removeOption = (index: number): void => {
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const handleConditionalChange = (field: keyof ConditionalLogic, value: string): void => {
    const logic = question.conditionalLogic || {};
    onUpdate({
      conditionalLogic: {
        ...logic,
        [field]: value
      }
    });
  };

  const otherQuestions = allQuestions.filter((q) => q.id !== question.id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">Question Text</label>
          <input
            type="text"
            value={question.text}
            onChange={handleTextChange}
            placeholder="Enter question"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">Question Type</label>
          <select
            value={question.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="text">Text Input</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="checkbox">Checkbox (Multi-select)</option>
            <option value="rating">Rating (1-5)</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={handleRequiredChange}
              className="w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm font-semibold text-slate-900">Required</span>
          </label>
        </div>
      </div>

      {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Options</label>
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="bg-red-600 hover:bg-red-700 text-sm text-white px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      {otherQuestions.length > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Conditional Logic (Optional)
          </label>
          <div className="space-y-3">
            <select
              value={question.conditionalLogic?.dependsOn || ''}
              onChange={(e) => handleConditionalChange('dependsOn', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              <option value="">Show always</option>
              {otherQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  Only show if: {q.text}
                </option>
              ))}
            </select>

            {question.conditionalLogic?.dependsOn && (
              <input
                type="text"
                value={question.conditionalLogic?.showWhen || ''}
                onChange={(e) => handleConditionalChange('showWhen', e.target.value)}
                placeholder="Value to match (e.g., 'Yes')"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ↑ Move Up
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ↓ Move Down
        </button>
        <button
          onClick={onRemove}
          className="ml-auto text-sm font-medium bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg transition-colors"
        >
          Delete Question
        </button>
      </div>
    </div>
  );
}

export default QuestionBuilder;
