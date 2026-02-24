"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TestFooterProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
  isMarkedForReview: boolean;
  disabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onNextSection: () => void;
  onToggleReview: () => void;
  onSubmit: () => void;
}

export function TestFooter({
  currentQuestionIndex,
  totalQuestions,
  isFirstQuestion,
  isLastQuestionInSection,
  isLastSection,
  isMarkedForReview,
  disabled = false,
  onPrevious,
  onNext,
  onNextSection,
  onToggleReview,
  onSubmit,
}: TestFooterProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="tabular-nums">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={onToggleReview}
          >
            {isMarkedForReview ? "Unmark Review" : "Mark for Review"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isFirstQuestion}
            onClick={onPrevious}
          >
            Previous
          </Button>

          {isLastQuestionInSection ? (
            isLastSection ? (
              <Button
                type="button"
                variant="destructive"
                disabled={disabled}
                onClick={onSubmit}
              >
                Submit Test
              </Button>
            ) : (
              <Button type="button" disabled={disabled} onClick={onNextSection}>
                Next Section
              </Button>
            )
          ) : (
            <Button type="button" disabled={disabled} onClick={onNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
