"use client";

import {
  QuestionStatus,
  getQuestionButtonClassName,
  questionStatusLegendOrder,
  questionStatusMeta,
} from "@/components/test/test-design-system";
import { memo } from "react";

interface QuestionNavigationProps {
  questionStatuses: QuestionStatus[];
  currentQuestion: number;
  onQuestionSelect: (questionNumber: number) => void;
}

export const QuestionNavigation = memo(function QuestionNavigation({
  questionStatuses,
  currentQuestion,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const totalQuestions = questionStatuses.length;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[hsl(var(--test-foreground))]">
        Question Navigation
      </h3>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionNumber = index + 1;
          const status = questionStatuses[index];

          return (
            <button
              key={questionNumber}
              className={getQuestionButtonClassName({
                status,
                isCurrent: currentQuestion === questionNumber,
              })}
              onClick={() => onQuestionSelect(questionNumber)}
              type="button"
            >
              {questionNumber}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {questionStatusLegendOrder.map((status) => (
          <div
            key={status}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${questionStatusMeta[status].legendCardClassName}`}
          >
            <span>{questionStatusMeta[status].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
