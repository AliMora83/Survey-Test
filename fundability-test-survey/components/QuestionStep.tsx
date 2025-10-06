
import React from 'react';
import type { Question } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface QuestionStepProps {
  question: Question;
  questionIndex: number;
  selectedAnswerIndex: number | null;
  onAnswerChange: (questionIndex: number, answerIndex: number) => void;
}

const QuestionStep: React.FC<QuestionStepProps> = ({ question, questionIndex, selectedAnswerIndex, onAnswerChange }) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">
        {question.text}
      </h3>
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswerIndex === index;
          return (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                  : 'bg-white border-slate-300 hover:border-blue-400'
              }`}
            >
              <input
                type="radio"
                name={`question-${questionIndex}`}
                checked={isSelected}
                onChange={() => onAnswerChange(questionIndex, index)}
                className="sr-only" 
              />
              <span className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center mr-4 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                {isSelected && <CheckIcon />}
              </span>
              <span className={`text-base ${isSelected ? 'font-semibold text-blue-800' : 'text-slate-700'}`}>
                {option.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionStep;
