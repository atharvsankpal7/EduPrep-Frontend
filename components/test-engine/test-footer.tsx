"use client";

import {
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TestFooterProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
  disabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onNextSection: () => void;
  onSubmit: () => void;
}

export function TestFooter({
  currentQuestionIndex,
  totalQuestions,
  isFirstQuestion,
  isLastQuestionInSection,
  isLastSection,
  disabled = false,
  onPrevious,
  onNext,
  onNextSection,
  onSubmit,
}: TestFooterProps) {
  return (
    <div className="te-footer" role="toolbar" aria-label="Test controls">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        {/* Left: Empty spacer or secondary actions could go here */}
        <div className="flex-1" />

        {/* Center/Right Group: Navigation */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isFirstQuestion}
            onClick={onPrevious}
            className="gap-1"
            aria-label="Previous question"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <Badge
            variant="outline"
            className="tabular-nums text-[0.6875rem] px-3 py-1"
          >
            {currentQuestionIndex + 1} / {totalQuestions}
          </Badge>

          {isLastQuestionInSection ? (
            isLastSection ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={disabled}
                onClick={onSubmit}
                className="gap-1.5 font-semibold"
                aria-label="Submit test"
              >
                <Send className="size-3.5" />
                Submit Test
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={disabled}
                onClick={onNextSection}
                className="gap-1.5 font-semibold"
                aria-label="Next section"
              >
                Next Section
                <ArrowRight className="size-4" />
              </Button>
            )
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={disabled}
              onClick={onNext}
              className="gap-1 bg-[hsl(var(--blue-primary))] font-semibold text-white hover:bg-[hsl(var(--blue-dark))]"
              aria-label="Save and next question"
            >
              Save & Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}
