"use client";

import {
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEFooter, TEContainer } from "@/components/test-engine/te-primitives";

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
    <TEFooter>
      <TEContainer className="flex items-center justify-between gap-4 px-2 sm:px-4">
        {/* Left: Previous button */}
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


        {/* Right: Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
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
                <span className="hidden sm:inline">Submit Test</span>
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
              className="gap-1.5 bg-[hsl(var(--blue-primary))] font-semibold text-white hover:bg-[hsl(var(--blue-dark))]"
              aria-label="Save and next question"
            >
              Save & Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </TEContainer>
    </TEFooter>
  );
}
