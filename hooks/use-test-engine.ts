"use client";

import { useCallback, useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";
import { buildSubmissionPayload } from "@/lib/test-engine/transformers";
import { submitWithRecovery } from "@/lib/test-engine/submit";
import { useTestEngineStore } from "@/lib/stores/test-engine-store";
import type {
  AutoSubmitReason,
  EngineTest,
  SubmitTestPayload,
} from "@/types/global/interface/test.apiInterface";

export type QuestionVisualState =
  | "not-visited"
  | "visited-unanswered"
  | "answered"
  | "marked-for-review";

interface SubmitTestOptions {
  isAutoSubmitted: boolean;
  reason: AutoSubmitReason;
}

interface ViolationOutcome {
  counted: boolean;
  strikes: number;
  isFinalWarning: boolean;
  autoSubmitted: boolean;
}

interface UseTestEngineOptions {
  test: EngineTest;
  onSubmit: (payload: SubmitTestPayload) => Promise<void>;
}

interface UseTestEngineReturn {
  started: boolean;
  submitted: boolean;
  controlsLocked: boolean;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  tabSwitches: number;
  currentSectionName: string;
  currentSectionQuestions: EngineTest["sections"][number]["questions"];
  currentQuestion:
  | EngineTest["sections"][number]["questions"][number]
  | undefined;
  selectedOption: number | undefined;
  isCurrentMarkedForReview: boolean;
  questionStatuses: QuestionVisualState[];
  isFirstQuestion: boolean;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
  startTest: () => void;
  selectOption: (optionIndex: number) => void;
  toggleReview: () => void;
  goPreviousQuestion: () => void;
  goNextQuestion: () => void;
  jumpToQuestion: (questionIndex: number) => void;
  moveToNextSection: () => boolean;
  onTimerTick: () => void;
  onSectionTimeout: () => Promise<"advanced" | "submitted" | "ignored">;
  submitTest: (options: SubmitTestOptions) => Promise<void>;
  registerProctorViolation: (reason: "tab_switch" | "fullscreen_exit") => ViolationOutcome;
}

const VIOLATION_COOLDOWN_MS = 1000;
const MAX_TAB_SWITCH_STRIKES = 3;

const defaultViolationOutcome: ViolationOutcome = {
  counted: false,
  strikes: 0,
  isFinalWarning: false,
  autoSubmitted: false,
};

export const useTestEngine = ({
  test,
  onSubmit,
}: UseTestEngineOptions): UseTestEngineReturn => {
  const {
    started,
    submitted,
    controlsLocked,
    currentSectionIndex,
    currentQuestionIndex,
    answers,
    visited,
    markedForReview,
    tabSwitches,
  } = useTestEngineStore(
    (state) => ({
      started: state.started,
      submitted: state.submitted,
      controlsLocked: state.controlsLocked,
      currentSectionIndex: state.currentSectionIndex,
      currentQuestionIndex: state.currentQuestionIndex,
      answers: state.answers,
      visited: state.visited,
      markedForReview: state.markedForReview,
      tabSwitches: state.tabSwitches,
    }),
    shallow
  );

  const initializeSession = useTestEngineStore((state) => state.initializeSession);
  const resetSession = useTestEngineStore((state) => state.resetSession);
  const startSession = useTestEngineStore((state) => state.startSession);
  const setCurrentSection = useTestEngineStore((state) => state.setCurrentSection);
  const setCurrentQuestion = useTestEngineStore((state) => state.setCurrentQuestion);
  const lockSection = useTestEngineStore((state) => state.lockSection);
  const setAnswer = useTestEngineStore((state) => state.setAnswer);
  const markVisited = useTestEngineStore((state) => state.markVisited);
  const toggleMarkedForReview = useTestEngineStore(
    (state) => state.toggleMarkedForReview
  );
  const incrementActiveSeconds = useTestEngineStore(
    (state) => state.incrementActiveSeconds
  );
  const setControlsLocked = useTestEngineStore((state) => state.setControlsLocked);
  const registerViolation = useTestEngineStore((state) => state.registerViolation);
  const setSubmitted = useTestEngineStore((state) => state.setSubmitted);

  useEffect(() => {
    initializeSession(test.id, test.sections.length);
    return () => {
      resetSession();
    };
  }, [initializeSession, resetSession, test.id, test.sections.length]);

  const currentSection =
    test.sections[currentSectionIndex] ?? test.sections[0] ?? undefined;
  const currentSectionQuestions = currentSection?.questions ?? [];

  useEffect(() => {
    if (currentSectionQuestions.length === 0) {
      return;
    }

    if (currentQuestionIndex >= currentSectionQuestions.length) {
      setCurrentQuestion(currentSectionQuestions.length - 1);
    }
  }, [currentQuestionIndex, currentSectionQuestions.length, setCurrentQuestion]);

  const currentQuestion =
    currentSectionQuestions[currentQuestionIndex] ??
    currentSectionQuestions[0] ??
    undefined;

  useEffect(() => {
    if (!started || !currentQuestion) {
      return;
    }

    markVisited(currentQuestion.id);
  }, [currentQuestion, markVisited, started]);

  const questionStatuses = useMemo<QuestionVisualState[]>(
    () =>
      currentSectionQuestions.map((question) => {
        if (markedForReview[question.id]) {
          return "marked-for-review";
        }

        if (answers[question.id] !== undefined) {
          return "answered";
        }

        if (visited[question.id]) {
          return "visited-unanswered";
        }

        return "not-visited";
      }),
    [answers, currentSectionQuestions, markedForReview, visited]
  );

  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isCurrentMarkedForReview = currentQuestion
    ? Boolean(markedForReview[currentQuestion.id])
    : false;

  const isFirstQuestion = currentQuestionIndex <= 0;
  const isLastQuestionInSection =
    currentQuestionIndex >= Math.max(0, currentSectionQuestions.length - 1);
  const isLastSection = currentSectionIndex >= test.sections.length - 1;

  const startTest = useCallback(() => {
    startSession();
  }, [startSession]);

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (submitted || controlsLocked || !currentQuestion) {
        return;
      }

      setAnswer(currentQuestion.id, optionIndex);
      markVisited(currentQuestion.id);
    },
    [controlsLocked, currentQuestion, markVisited, setAnswer, submitted]
  );

  const toggleReview = useCallback(() => {
    if (submitted || controlsLocked || !currentQuestion) {
      return;
    }

    toggleMarkedForReview(currentQuestion.id);
  }, [controlsLocked, currentQuestion, submitted, toggleMarkedForReview]);

  const goPreviousQuestion = useCallback(() => {
    if (submitted || controlsLocked) {
      return;
    }

    setCurrentQuestion(Math.max(0, currentQuestionIndex - 1));
  }, [controlsLocked, currentQuestionIndex, setCurrentQuestion, submitted]);

  const goNextQuestion = useCallback(() => {
    if (submitted || controlsLocked) {
      return;
    }

    setCurrentQuestion(
      Math.min(currentQuestionIndex + 1, currentSectionQuestions.length - 1)
    );
  }, [
    controlsLocked,
    currentQuestionIndex,
    currentSectionQuestions.length,
    setCurrentQuestion,
    submitted,
  ]);

  const jumpToQuestion = useCallback(
    (questionIndex: number) => {
      if (submitted || controlsLocked) {
        return;
      }

      const maxIndex = Math.max(0, currentSectionQuestions.length - 1);
      setCurrentQuestion(Math.min(Math.max(questionIndex, 0), maxIndex));
    },
    [controlsLocked, currentSectionQuestions.length, setCurrentQuestion, submitted]
  );

  const moveToNextSection = useCallback(() => {
    if (submitted || controlsLocked || isLastSection) {
      return false;
    }

    lockSection(currentSectionIndex);
    setCurrentSection(currentSectionIndex + 1);
    return true;
  }, [
    controlsLocked,
    currentSectionIndex,
    isLastSection,
    lockSection,
    setCurrentSection,
    submitted,
  ]);

  const submitTest = useCallback(
    async ({ isAutoSubmitted, reason }: SubmitTestOptions) => {
      const latestState = useTestEngineStore.getState();
      const payload = buildSubmissionPayload({
        test,
        answers: latestState.answers,
        timeTakenSeconds: latestState.totalActiveSeconds,
        isAutoSubmitted,
        tabSwitches: latestState.tabSwitches,
      });

      await submitWithRecovery({
        submitted,
        controlsLocked,
        payload,
        onSubmit,
        setControlsLocked,
        setSubmitted,
      });
    },
    [controlsLocked, onSubmit, setControlsLocked, setSubmitted, submitted]
  );

  const onSectionTimeout = useCallback(async () => {
    if (!started || submitted || controlsLocked) {
      return "ignored";
    }

    if (!isLastSection) {
      moveToNextSection();
      return "advanced";
    }

    await submitTest({ isAutoSubmitted: true, reason: "time_up" });
    return "submitted";
  }, [
    controlsLocked,
    isLastSection,
    moveToNextSection,
    started,
    submitTest,
    submitted,
  ]);

  const registerProctorViolation = useCallback(
    (reason: "tab_switch" | "fullscreen_exit") => {
      if (!started || submitted) {
        return defaultViolationOutcome;
      }

      const result = registerViolation(
        Date.now(),
        VIOLATION_COOLDOWN_MS,
        MAX_TAB_SWITCH_STRIKES
      );

      if (!result.counted) {
        return {
          ...defaultViolationOutcome,
          strikes: tabSwitches,
        };
      }

      if (result.autoSubmit) {
        void submitTest({
          isAutoSubmitted: true,
          reason,
        }).catch(() => undefined);
      }

      return {
        counted: true,
        strikes: result.strikes,
        isFinalWarning: result.strikes === MAX_TAB_SWITCH_STRIKES - 1,
        autoSubmitted: result.autoSubmit,
      };
    },
    [registerViolation, started, submitTest, submitted, tabSwitches]
  );

  const onTimerTick = useCallback(() => {
    incrementActiveSeconds();
  }, [incrementActiveSeconds]);

  return {
    started,
    submitted,
    controlsLocked,
    currentSectionIndex,
    currentQuestionIndex,
    tabSwitches,
    currentSectionName: currentSection?.sectionName ?? "Section",
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
  };
};
