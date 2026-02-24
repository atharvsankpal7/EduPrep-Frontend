"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useTestEngine } from "@/hooks/use-test-engine";
import { QuestionGridBox } from "@/components/test-engine/question-grid-box";
import { QuestionPanel } from "@/components/test-engine/question-panel";
import { TestFooter } from "@/components/test-engine/test-footer";
import { SectionTimer } from "@/components/test-engine/section-timer";
import { ProctoringManager } from "@/components/test-engine/proctoring-manager";
import {
  ConsentRulesDialog,
  SectionLockDialog,
  StrikeWarningDialog,
  SubmitConfirmDialog,
} from "@/components/test-engine/dialogs";
import type {
  EngineTest,
  SubmitTestPayload,
} from "@/types/global/interface/test.apiInterface";

interface TestEngineShellProps {
  test: EngineTest;
  isSubmitting: boolean;
  onSubmit: (payload: SubmitTestPayload) => Promise<void>;
}

const requestBrowserFullscreen = async () => {
  try {
    if (document.fullscreenElement) {
      return true;
    }

    await document.documentElement.requestFullscreen();
    return true;
  } catch {
    return false;
  }
};

export function TestEngineShell({
  test,
  isSubmitting,
  onSubmit,
}: TestEngineShellProps) {
  const { toast } = useToast();
  const [isConsentOpen, setIsConsentOpen] = useState(true);
  const [isSectionLockDialogOpen, setIsSectionLockDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [strikeDialogState, setStrikeDialogState] = useState({
    open: false,
    strikeCount: 0,
    isFinalWarning: false,
  });

  const {
    started,
    submitted,
    controlsLocked,
    currentSectionIndex,
    currentQuestionIndex,
    currentSectionName,
    currentSectionQuestions,
    currentQuestion,
    selectedOption,
    isCurrentMarkedForReview,
    questionStatuses,
    isFirstQuestion,
    isLastQuestionInSection,
    isLastSection,
    startTest,
    selectOption,
    toggleReview,
    goPreviousQuestion,
    goNextQuestion,
    jumpToQuestion,
    moveToNextSection,
    onTimerTick,
    onSectionTimeout,
    submitTest,
    registerProctorViolation,
  } = useTestEngine({
    test,
    onSubmit,
  });

  const currentSection = test.sections[currentSectionIndex];
  const sectionKey = currentSection?.id ?? `section-${currentSectionIndex + 1}`;
  const sectionDurationSeconds = Math.max(
    0,
    (currentSection?.sectionDuration ?? 0) * 60
  );
  const controlsDisabled = !started || submitted || controlsLocked || isSubmitting;

  const questionCountText = useMemo(
    () => `${currentQuestionIndex + 1}/${Math.max(currentSectionQuestions.length, 0)}`,
    [currentQuestionIndex, currentSectionQuestions.length]
  );

  useEffect(() => {
    if (!submitted || !document.fullscreenElement) {
      return;
    }

    void document.exitFullscreen();
  }, [submitted]);

  const handleStartTest = useCallback(async () => {
    const enteredFullscreen = await requestBrowserFullscreen();
    if (!enteredFullscreen) {
      toast({
        title: "Fullscreen required",
        description: "Please allow fullscreen mode to start the test.",
        variant: "destructive",
      });
      return;
    }

    startTest();
    setIsConsentOpen(false);
  }, [startTest, toast]);

  const handleViolation = useCallback(
    (reason: "tab_switch" | "fullscreen_exit") => {
      const result = registerProctorViolation(reason);
      if (!result.counted) {
        return;
      }

      if (result.autoSubmitted) {
        toast({
          title: "Test Auto-Submitted",
          description:
            "Third integrity violation detected. Your test was submitted automatically.",
          variant: "destructive",
        });
        return;
      }

      setStrikeDialogState({
        open: true,
        strikeCount: result.strikes,
        isFinalWarning: result.isFinalWarning,
      });
    },
    [registerProctorViolation, toast]
  );

  const handleClipboardViolation = useCallback(() => {
    toast({
      title: "Action blocked",
      description: "Copy, cut, and paste are disabled during the test.",
      variant: "destructive",
    });
  }, [toast]);

  const handleContextMenuViolation = useCallback(() => {
    toast({
      title: "Action blocked",
      description: "Right click is disabled during the test.",
      variant: "destructive",
    });
  }, [toast]);

  const handleStrikeAcknowledge = useCallback(async () => {
    const enteredFullscreen = await requestBrowserFullscreen();
    if (!enteredFullscreen) {
      toast({
        title: "Fullscreen required",
        description: "Return to fullscreen mode before continuing.",
        variant: "destructive",
      });
      return;
    }

    setStrikeDialogState((previous) => ({
      ...previous,
      open: false,
    }));
  }, [toast]);

  const handleTimerExpired = useCallback(async () => {
    const outcome = await onSectionTimeout();
    if (outcome === "advanced") {
      toast({
        title: "Section Time Up",
        description:
          "Time for this section has ended. Moved to the next section automatically.",
      });
      return;
    }

    if (outcome === "submitted") {
      toast({
        title: "Time Up",
        description: "Test has been auto-submitted.",
        variant: "destructive",
      });
    }
  }, [onSectionTimeout, toast]);

  const handleSectionAdvance = useCallback(() => {
    const moved = moveToNextSection();
    setIsSectionLockDialogOpen(false);
    if (!moved) {
      return;
    }

    const nextSectionName = test.sections[currentSectionIndex + 1]?.sectionName;
    toast({
      title: "Section Started",
      description: nextSectionName
        ? `You are now in ${nextSectionName}.`
        : "Moved to the next section.",
    });
  }, [currentSectionIndex, moveToNextSection, test.sections, toast]);

  const handleManualSubmit = useCallback(async () => {
    setIsSubmitDialogOpen(false);
    try {
      await submitTest({
        isAutoSubmitted: false,
        reason: "manual",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to submit your test at the moment.",
        variant: "destructive",
      });
    }
  }, [submitTest, toast]);

  const handleAutoSubmitFailure = useCallback(
    (error: unknown) => {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to submit your test at the moment.",
        variant: "destructive",
      });
    },
    [toast]
  );

  if (!started) {
    return (
      <>
        <ConsentRulesDialog open={isConsentOpen} onStart={handleStartTest} />
        <div className="mx-auto flex w-full max-w-4xl px-4 py-10">
          <Card className="w-full border-border">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertTriangle className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-pretty">
                Test content remains hidden until you acknowledge all rules and
                start in fullscreen mode.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No questions available for this section.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ProctoringManager
        enabled={started && !submitted}
        onStrikeViolation={handleViolation}
        onClipboardViolation={handleClipboardViolation}
        onContextMenuViolation={handleContextMenuViolation}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:py-6">
        <header className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-balance">{test.testName}</h1>
            <p className="text-sm text-muted-foreground">
              Section {currentSectionIndex + 1} of {test.sections.length}:{" "}
              {currentSectionName}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              Question {questionCountText}
            </p>
          </div>

          <SectionTimer
            sectionKey={sectionKey}
            initialSeconds={sectionDurationSeconds}
            isRunning={!submitted && !isSubmitting}
            onTick={onTimerTick}
            onExpire={() => {
              void handleTimerExpired().catch(handleAutoSubmitFailure);
            }}
          />
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <QuestionPanel
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            selectedOption={selectedOption}
            isMarkedForReview={isCurrentMarkedForReview}
            onSelectOption={selectOption}
            disabled={controlsDisabled}
          />

          <QuestionGridBox
            totalQuestions={currentSectionQuestions.length}
            currentQuestionIndex={currentQuestionIndex}
            questionStatuses={questionStatuses}
            onSelectQuestion={jumpToQuestion}
            disabled={controlsDisabled}
          />
        </div>
      </div>

      <TestFooter
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentSectionQuestions.length}
        isFirstQuestion={isFirstQuestion}
        isLastQuestionInSection={isLastQuestionInSection}
        isLastSection={isLastSection}
        isMarkedForReview={isCurrentMarkedForReview}
        disabled={controlsDisabled}
        onPrevious={goPreviousQuestion}
        onNext={goNextQuestion}
        onNextSection={() => setIsSectionLockDialogOpen(true)}
        onToggleReview={toggleReview}
        onSubmit={() => setIsSubmitDialogOpen(true)}
      />

      <StrikeWarningDialog
        open={strikeDialogState.open}
        strikeCount={strikeDialogState.strikeCount}
        isFinalWarning={strikeDialogState.isFinalWarning}
        onAcknowledge={handleStrikeAcknowledge}
      />

      <SectionLockDialog
        open={isSectionLockDialogOpen}
        onCancel={() => setIsSectionLockDialogOpen(false)}
        onConfirm={handleSectionAdvance}
      />

      <SubmitConfirmDialog
        open={isSubmitDialogOpen}
        onCancel={() => setIsSubmitDialogOpen(false)}
        onConfirm={() => {
          void handleManualSubmit();
        }}
      />
    </>
  );
}
