"use client";

import { StickyBar } from "@/components/common/sticky-bar";
import { Button } from "@/components/ui/button";
import { SubmitConfirmDialog } from "@/components/test/submit-confirm-dialog";

interface TestFooterProps {
  currentQuestion: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onNextSection: () => void;
  onSubmit: () => void;
}

export function TestFooter({
  currentQuestion,
  totalQuestions,
  isFirstQuestion,
  isLastQuestionInSection,
  isLastSection,
  onPrevious,
  onNext,
  onNextSection,
  onSubmit,
}: TestFooterProps) {
  return (
    <StickyBar position="bottom">
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-3 px-1 lg:px-6">
        <Button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          variant="outline"
          className="min-w-[110px]"
        >
          Previous
        </Button>

        <span className="hidden sm:block text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>

        {isLastQuestionInSection ? (
          isLastSection ? (
            <SubmitConfirmDialog
              onSubmit={onSubmit}
              trigger={(
                <Button className="min-w-[110px]">
                  Submit Test
                </Button>
              )}
            />
          ) : (
            <Button onClick={onNextSection}>
              Next Section
            </Button>
          )
        ) : (
          <Button
            onClick={onNext}
            className="min-w-[110px]"
          >
            Next
          </Button>
        )}
      </div>
    </StickyBar>
  );
}
