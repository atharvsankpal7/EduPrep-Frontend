"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  GripVertical,
  LayoutGrid,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
} from "lucide-react";
import { shallow } from "zustand/shallow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEHeader, TEContainer, TEProgressBar } from "@/components/test-engine/te-primitives";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useTestEngine } from "@/hooks/use-test-engine";
import { useTestHotkeys } from "@/hooks/use-test-hotkeys";
import { useTestEngineStore } from "@/lib/stores/test-engine-store";
import { QuestionGridBox } from "@/components/test-engine/question-grid-box";
import { QuestionPanel } from "@/components/test-engine/question-panel";
import { TestFooter } from "@/components/test-engine/test-footer";
import { SectionTimer } from "@/components/test-engine/section-timer";
import { ProctoringManager } from "@/components/test-engine/proctoring-manager";
import { TestOverviewDrawer } from "@/components/test-engine/test-overview-drawer";
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
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [strikeDialogState, setStrikeDialogState] = useState({
    open: false,
    strikeCount: 0,
    isFinalWarning: false,
  });

  const { answers, visited, markedForReview } = useTestEngineStore(
    (state) => ({
      answers: state.answers,
      visited: state.visited,
      markedForReview: state.markedForReview,
    }),
    shallow
  );

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
  const sectionKey =
    currentSection?.id ?? `section-${currentSectionIndex + 1}`;
  const sectionDurationSeconds = Math.max(
    0,
    (currentSection?.sectionDuration ?? 0) * 60
  );
  const controlsDisabled =
    !started || submitted || controlsLocked || isSubmitting;


  const questionCountText = useMemo(
    () =>
      `${currentQuestionIndex + 1}/${Math.max(
        currentSectionQuestions.length,
        0
      )}`,
    [currentQuestionIndex, currentSectionQuestions.length]
  );

  // Clear response handler
  const clearResponse = useCallback(() => {
    if (controlsDisabled || !currentQuestion) return;
    const store = useTestEngineStore.getState();
    const newAnswers = { ...store.answers };
    delete newAnswers[currentQuestion.id];
    useTestEngineStore.setState({ answers: newAnswers });
  }, [controlsDisabled, currentQuestion]);

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

  const onTimerExpire = useCallback(() => {
    void handleTimerExpired().catch(handleAutoSubmitFailure);
  }, [handleTimerExpired, handleAutoSubmitFailure]);

  const handleSectionAdvance = useCallback(() => {
    const moved = moveToNextSection();
    setIsSectionLockDialogOpen(false);
    if (!moved) {
      return;
    }

    const nextSectionName =
      test.sections[currentSectionIndex + 1]?.sectionName;
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

  // Keyboard shortcuts
  useTestHotkeys({
    enabled: started && !submitted && !controlsLocked && !isSubmitting,
    optionCount: currentQuestion?.options.length ?? 4,
    onSelectOption: selectOption,
    onNext: goNextQuestion,
    onPrevious: goPreviousQuestion,
    onToggleReview: toggleReview,
    onSaveAndNext: goNextQuestion,
  });

  // ─── Pre-start state ─────────────────────────────────────
  if (!started && !submitted && !isSubmitting) {
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

  // ─── Empty section state ──────────────────────────────────
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

  // ─── Shared question panel instance ───────────────────────
  const questionPanel = (
    <QuestionPanel
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      selectedOption={selectedOption}
      isMarkedForReview={isCurrentMarkedForReview}
      onSelectOption={selectOption}
      onToggleReview={toggleReview}
      onClearResponse={clearResponse}
      disabled={controlsDisabled}
    />
  );

  const questionGrid = (
    <QuestionGridBox
      totalQuestions={currentSectionQuestions.length}
      currentQuestionIndex={currentQuestionIndex}
      questionStatuses={questionStatuses}
      onSelectQuestion={jumpToQuestion}
      disabled={controlsDisabled}
    />
  );

  // ─── Main test interface ──────────────────────────────────
  return (
    <>
      <ProctoringManager
        enabled={test.proctoringEnabled && started && !submitted}
        onStrikeViolation={handleViolation}
        onClipboardViolation={handleClipboardViolation}
        onContextMenuViolation={handleContextMenuViolation}
      />

      {/* ── Glass header ── */}
      <TEHeader>
        <TEContainer className="py-2.5 sm:py-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-foreground md:text-base">
                {test.testName}
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Section {currentSectionIndex + 1} of {test.sections.length}
                {" · "}
                {currentSectionName}
                {" · "}
                <span className="tabular-nums">Q {questionCountText}</span>
              </p>
            </div>

            <SectionTimer
              sectionKey={sectionKey}
              initialSeconds={sectionDurationSeconds}
              isRunning={!submitted && !isSubmitting}
              onTick={onTimerTick}
              onExpire={onTimerExpire}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2">
            <p className="truncate text-[0.6875rem] text-muted-foreground sm:hidden">
              Sec {currentSectionIndex + 1}/{test.sections.length}
              {" · "}
              <span className="tabular-nums">Q {questionCountText}</span>
            </p>

            {/* Spacer for sm+ so buttons push right */}
            <div className="hidden sm:block sm:flex-1" />

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 min-w-[36px] gap-1 px-2 text-xs sm:gap-1.5 sm:px-3"
                onClick={() => setIsOverviewOpen(true)}
                aria-label="Open test overview"
              >
                <LayoutGrid className="size-3.5" />
                <span className="hidden sm:inline">Overview</span>
              </Button>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hidden lg:inline-flex size-8"
                      onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                      aria-label={
                        isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"
                      }
                    >
                      {isSidebarCollapsed ? (
                        <PanelLeftOpen className="size-4" />
                      ) : (
                        <PanelLeftClose className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {isSidebarCollapsed ? "Show palette" : "Hide palette"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="h-4 w-px bg-border" />

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-semibold border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground sm:gap-1.5 sm:px-3"
                onClick={() => {
                  if (isLastSection) {
                    setIsSubmitDialogOpen(true);
                  } else {
                    setIsSectionLockDialogOpen(true);
                  }
                }}
                disabled={controlsDisabled}
              >
                {isSubmitting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Send className="size-3" />
                )}
                <span className="hidden sm:inline">
                  {isSubmitting
                    ? "Submitting…"
                    : isLastSection
                      ? "Submit Test"
                      : "Submit Section"}
                </span>
                <span className="sm:hidden">
                  {isSubmitting ? "Submitting…" : "Submit"}
                </span>
              </Button>
            </div>
          </div>
        </TEContainer>


      </TEHeader>

      {/* ── Content area ── */}
      <TEContainer className="py-4 pb-24 md:py-6 md:pb-28">
        {/* Desktop: resizable split pane */}
        <div className="hidden lg:block">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[60vh] rounded-xl"
          >
            <ResizablePanel
              defaultSize={isSidebarCollapsed ? 100 : 72}
              minSize={55}
              className="te-panel-expand"
            >
              {questionPanel}
            </ResizablePanel>

            {!isSidebarCollapsed && (
              <>
                <ResizableHandle className="mx-2 group">
                  <div className="te-drag-handle opacity-60 group-hover:opacity-100">
                    <GripVertical className="size-3.5" />
                  </div>
                </ResizableHandle>
                <ResizablePanel
                  defaultSize={28}
                  minSize={20}
                  maxSize={40}
                >
                  {questionGrid}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>

        {/* Mobile: stacked layout */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {questionPanel}
          {questionGrid}
        </div>
      </TEContainer>

      {/* ── Footer (navigation only) ── */}
      <TestFooter
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentSectionQuestions.length}
        isFirstQuestion={isFirstQuestion}
        isLastQuestionInSection={isLastQuestionInSection}
        isLastSection={isLastSection}
        disabled={controlsDisabled}
        onPrevious={goPreviousQuestion}
        onNext={goNextQuestion}
        onNextSection={() => setIsSectionLockDialogOpen(true)}
        onSubmit={() => setIsSubmitDialogOpen(true)}
      />

      {/* ── Overview drawer ── */}
      <TestOverviewDrawer
        open={isOverviewOpen}
        onOpenChange={setIsOverviewOpen}
        test={test}
        currentSectionIndex={currentSectionIndex}
        answers={answers}
        visited={visited}
        markedForReview={markedForReview}
      />

      {/* ── Dialogs ── */}
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
