"use client";

import { CheckCircle2, Circle, AlertCircle, Bookmark } from "lucide-react";
import { testUi } from "@/components/test/test-design-system";

interface TestProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  visitedQuestions: number;
  markedForReviewQuestions: number;
}

export function TestProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  visitedQuestions,
  markedForReviewQuestions,
}: TestProgressProps) {
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[hsl(var(--test-foreground))]">Progress</h3>

      <div className="space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--test-border))]">
          <div
            className="h-full rounded-full bg-[hsl(var(--test-primary))] transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>

        <div className={`flex justify-between ${testUi.bodyText}`}>
          <span>{Math.round(progress)}% Complete</span>
          <span>
            {answeredQuestions}/{totalQuestions}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
          <div className="flex items-center justify-between text-sm text-emerald-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Answered
            </div>
            <span className="font-semibold">{answeredQuestions}</span>
          </div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2">
          <div className="flex items-center justify-between text-sm text-violet-700">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Review
            </div>
            <span className="font-semibold">{markedForReviewQuestions}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[hsl(var(--test-muted-foreground))]">
        <div className="flex items-center space-x-2">
          <Circle className="h-4 w-4" />
          <span>Visited</span>
        </div>
        <span>{visitedQuestions}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-[hsl(var(--test-muted-foreground))]">
        <div className="flex items-center space-x-2">
          <Circle className="h-4 w-4" />
          <span>Remaining</span>
        </div>
        <span>{Math.max(totalQuestions - answeredQuestions, 0)}</span>
      </div>

      {answeredQuestions < currentQuestion && (
        <div className="flex items-center space-x-2 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4" />
          <span>Current question not answered</span>
        </div>
      )}
    </div>
  );
}
