"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Timer } from "@/components/test/timer";
import { QuestionPanel } from "@/components/test/question-panel";
import { TestHeader } from "@/components/test/test-header";
import { QuestionNavigation } from "@/components/test/question-navigation";
import { TabSwitchWarningModal } from "@/components/test/tab-switch-warning-modal";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WarningModal } from "@/components/test/warning-modal";
import {
  QuestionStatus,
  testInterfaceTheme,
  testUi,
} from "@/components/test/test-design-system";
import { TestSurface } from "@/components/test/ui/test-surface";

export interface Question {
  question: string;
  options: string[];
  correctAnswer?: number;
  id?: string;
}

interface Section {
  name: string;
  duration: number;
  questions: Question[];
}

export interface TestInterfaceProps {
  testId: string;
  testName: string;
  sections: Section[];
  onComplete: (answers: Record<number, number>, timeSpent: number) => void;
}

export function TestInterface({
  testId: _testId,
  testName,
  sections,
  onComplete,
}: TestInterfaceProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<
    Record<number, boolean>
  >({});
  const [markedForReview, setMarkedForReview] = useState<
    Record<number, boolean>
  >({});

  // Refactor: Use ref for time tracking to prevent 1Hz re-renders
  const timeLeftRef = useRef(sections[0].duration * 60);

  const [testStarted, setTestStarted] = useState(false);
  const [sectionCompleted, setSectionCompleted] = useState<boolean[]>(
    new Array(sections.length).fill(false),
  );
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [sessionTabSwitchCount, setSessionTabSwitchCount] = useState(0);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [isLastWarning, setIsLastWarning] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const hasAutoSubmittedRef = useRef(false);
  const handleSubmitRef = useRef<() => void>(() => undefined);
  const { toast } = useToast();

  const getSectionStartIndex = (sectionIndex: number) =>
    sections
      .slice(0, sectionIndex)
      .reduce((total, section) => total + section.questions.length, 0);

  const currentSectionStartIndex = getSectionStartIndex(currentSection);
  const currentGlobalQuestionIndex = currentSectionStartIndex + currentQuestion;

  const handleTimeUpdate = useCallback((time: number) => {
    timeLeftRef.current = time;
  }, []);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } catch (error) {
        console.error("Failed to enter fullscreen:", error);
      }
    };

    if (testStarted) {
      enterFullscreen();
      document.body.classList.add("test-mode");
    }

    return () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
      document.body.classList.remove("test-mode");
    };
  }, [testStarted]);

  useEffect(() => {
    handleSubmitRef.current = () => {
      const finalTimeSpent =
        totalTimeSpent +
        (sections[currentSection].duration * 60 - timeLeftRef.current);
      onComplete(answers, finalTimeSpent);
    };
  }, [answers, currentSection, onComplete, sections, totalTimeSpent]);

  const handleSubmit = () => {
    handleSubmitRef.current();
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && testStarted && !hasAutoSubmittedRef.current) {
        setSessionTabSwitchCount((previous) => previous + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted || sessionTabSwitchCount === 0) {
      return;
    }

    if (sessionTabSwitchCount <= 2) {
      setWarningModalOpen(true);
      setIsLastWarning(false);
      setIsAutoSubmitted(false);
      return;
    }

    if (sessionTabSwitchCount === 3) {
      setWarningModalOpen(true);
      setIsLastWarning(true);
      setIsAutoSubmitted(false);
      return;
    }

    if (!hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      setWarningModalOpen(true);
      setIsLastWarning(false);
      setIsAutoSubmitted(true);
      handleSubmitRef.current();
    }
  }, [sessionTabSwitchCount, testStarted]);

  useEffect(() => {
    const preventCopyPaste = (event: ClipboardEvent) => {
      event.preventDefault();
      toast({
        title: "Action not allowed",
        description: "Copy and paste are disabled during the test",
        variant: "destructive",
      });
    };

    if (testStarted) {
      document.addEventListener("copy", preventCopyPaste);
      document.addEventListener("paste", preventCopyPaste);
      document.addEventListener("cut", preventCopyPaste);
    }

    return () => {
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("cut", preventCopyPaste);
    };
  }, [testStarted, toast]);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    if (testStarted) {
      document.addEventListener("contextmenu", preventContextMenu);
    }

    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted) {
      return;
    }

    setVisitedQuestions((previous) =>
      previous[currentGlobalQuestionIndex]
        ? previous
        : { ...previous, [currentGlobalQuestionIndex]: true },
    );
  }, [currentGlobalQuestionIndex, testStarted]);

  const getQuestionStatus = (globalQuestionIndex: number): QuestionStatus => {
    if (markedForReview[globalQuestionIndex]) {
      return "markedForReview";
    }

    if (answers[globalQuestionIndex] !== undefined) {
      return "answered";
    }

    if (visitedQuestions[globalQuestionIndex]) {
      return "visitedUnanswered";
    }

    return "notVisited";
  };

  const handleAnswer = (answerId: number) => {
    setAnswers((previous) => ({
      ...previous,
      [currentGlobalQuestionIndex]: answerId,
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview((previous) => ({
      ...previous,
      [currentGlobalQuestionIndex]: !previous[currentGlobalQuestionIndex],
    }));
  };

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      const updatedSectionCompleted = [...sectionCompleted];
      updatedSectionCompleted[currentSection] = true;
      setSectionCompleted(updatedSectionCompleted);

      const sectionDialogTrigger = document.getElementById(
        "section-warning-dialog",
      ) as HTMLButtonElement | null;

      sectionDialogTrigger?.click();
    }
  };

  const confirmNextSection = () => {
    if (currentSection < sections.length - 1) {
      setTotalTimeSpent(
        (previous) =>
          previous +
          (sections[currentSection].duration * 60 - timeLeftRef.current),
      );

      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setCurrentQuestion(0);
      timeLeftRef.current = sections[nextSection].duration * 60;
      toast({
        title: "New Section Started",
        description: `You are now in ${sections[nextSection].name}`,
      });
    }
  };

  const handleTimeUp = () => {
    if (currentSection < sections.length - 1) {
      handleNextSection();
      return;
    }

    handleSubmit();
  };

  const handleStartTest = () => {
    hasAutoSubmittedRef.current = false;
    setSessionTabSwitchCount(0);
    setWarningModalOpen(false);
    setIsLastWarning(false);
    setIsAutoSubmitted(false);
    setTestStarted(true);
  };

  const currentSectionQuestions = sections[currentSection].questions;
  const currentQuestionData = currentSectionQuestions[currentQuestion];
  const questionStatuses = currentSectionQuestions.map((_, index) =>
    getQuestionStatus(currentSectionStartIndex + index),
  );

  if (!testStarted) {
    return <WarningModal onStart={handleStartTest} />;
  }

  return (
    <div className={cn(testUi.page, "py-2 lg:py-8")} style={testInterfaceTheme}>
      <TestHeader testName={`${testName} - ${sections[currentSection].name}`} />

      <div className={testUi.container}>
        <TestSurface className="mb-6 p-4 lg:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <h2 className={testUi.sectionTitle}>
                Section: {sections[currentSection].name}
              </h2>
              <p className={testUi.bodyText}>
                Attempt questions, flag uncertain ones, and review before
                submission.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Timer
                key={currentSection}
                variant="inline"
                duration={sections[currentSection].duration * 60}
                onTimeUpdate={handleTimeUpdate}
                onTimeUp={handleTimeUp}
              />
              {currentSection < sections.length - 1 && (
                <Button
                  onClick={handleNextSection}
                  variant="outline"
                  className={testUi.secondaryButton}
                >
                  Next Section
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {sections.map((section, index) => (
              <span
                key={section.name}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium",
                  index === currentSection
                    ? "border-[hsl(var(--test-primary))] bg-teal-50 text-[hsl(var(--test-primary))]"
                    : "border-[hsl(var(--test-border-strong))] bg-[hsl(var(--test-surface-muted))] text-[hsl(var(--test-muted-foreground))]",
                  sectionCompleted[index] && "opacity-65",
                )}
              >
                {section.name}
              </span>
            ))}
          </div>
        </TestSurface>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <div key={currentGlobalQuestionIndex}>
              <TestSurface className="p-5 lg:p-6">
                <QuestionPanel
                  questionNumber={currentQuestion + 1}
                  questionText={currentQuestionData.question}
                  options={currentQuestionData.options}
                  onAnswer={handleAnswer}
                  selectedAnswer={answers[currentGlobalQuestionIndex]}
                  isMarkedForReview={Boolean(
                    markedForReview[currentGlobalQuestionIndex],
                  )}
                  onToggleReview={handleToggleReview}
                />
              </TestSurface>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <TestSurface className="p-4">
              <QuestionNavigation
                questionStatuses={questionStatuses}
                currentQuestion={currentQuestion + 1}
                onQuestionSelect={(questionNumber) =>
                  setCurrentQuestion(questionNumber - 1)
                }
              />
            </TestSurface>
          </div>
        </div>

        <div className={testUi.fixedBar}>
          <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-3 px-1 lg:px-6">
            <Button
              onClick={() =>
                setCurrentQuestion((previous) => Math.max(0, previous - 1))
              }
              disabled={currentQuestion === 0}
              variant="outline"
              className={cn(testUi.secondaryButton, "min-w-[110px]")}
            >
              Previous
            </Button>

            <span className={`hidden sm:block ${testUi.bodyText}`}>
              Question {currentQuestion + 1} of {currentSectionQuestions.length}
            </span>

            {currentQuestion === currentSectionQuestions.length - 1 ? (
              currentSection === sections.length - 1 ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={cn(testUi.primaryButton, "min-w-[110px]")}
                    >
                      Submit Test
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to submit the test? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className={testUi.secondaryButton}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSubmit}
                        className={testUi.primaryButton}
                      >
                        Submit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  onClick={handleNextSection}
                  className={testUi.primaryButton}
                >
                  Next Section
                </Button>
              )
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestion((previous) =>
                    Math.min(currentSectionQuestions.length - 1, previous + 1),
                  )
                }
                className={cn(testUi.primaryButton, "min-w-[110px]")}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger id="section-warning-dialog" className="hidden" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Warning: Section Change
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to move to the next section. Please note:
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  You cannot return to the previous section once you proceed
                </li>
                <li>
                  All unanswered questions in the current section will be marked
                  as not attempted
                </li>
                <li>Make sure you have reviewed all your answers</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={testUi.secondaryButton}>
              Stay in Current Section
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmNextSection}
              className={testUi.primaryButton}
            >
              Proceed to Next Section
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TabSwitchWarningModal
        open={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        tabSwitchCount={sessionTabSwitchCount}
        isLastWarning={isLastWarning}
        isAutoSubmitted={isAutoSubmitted}
      />
    </div>
  );
}
