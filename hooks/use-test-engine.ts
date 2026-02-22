"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { QuestionStatus } from "@/components/test/question-status";
import type { TestSection } from "@/types/global/interface/test.apiInterface";

export interface AutoSubmissionMeta {
  isAutoSubmitted: boolean;
  tabSwitches: number;
}

interface UseTestEngineOptions {
  sections: TestSection[];
  onComplete: (
    answers: Record<number, number>,
    timeSpent: number,
    autoSubmission: AutoSubmissionMeta
  ) => void;
}

interface UseTestEngineReturn {
  testStarted: boolean;
  currentSection: number;
  currentQuestion: number;
  currentGlobalQuestionIndex: number;
  currentSectionQuestions: TestSection["questions"];
  currentQuestionData: TestSection["questions"][number];
  questionStatuses: QuestionStatus[];
  sectionCompleted: boolean[];
  sectionChangeRequested: boolean;
  answers: Record<number, number>;
  selectedAnswer: number | undefined;
  isCurrentMarkedForReview: boolean;
  totalSections: number;
  isFirstQuestion: boolean;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
  startTest: () => void;
  selectAnswer: (answerId: number) => void;
  toggleReview: () => void;
  navigateToQuestion: (questionNumber: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  requestNextSection: () => void;
  confirmNextSection: () => number | null;
  cancelSectionChange: () => void;
  updateTimeLeft: (timeLeft: number) => void;
  handleTimeUp: (autoSubmission?: AutoSubmissionMeta) => void;
  submitTest: (autoSubmission?: AutoSubmissionMeta) => void;
}

const defaultAutoSubmissionMeta: AutoSubmissionMeta = {
  isAutoSubmitted: false,
  tabSwitches: 0,
};

const fallbackQuestion: TestSection["questions"][number] = {
  question: "No question available for this section.",
  options: [],
  correctAnswer: 0,
  id: "",
};

export function useTestEngine({
  sections,
  onComplete,
}: UseTestEngineOptions): UseTestEngineReturn {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<
    Record<number, boolean>
  >({});
  const [markedForReview, setMarkedForReview] = useState<
    Record<number, boolean>
  >({});
  const [testStarted, setTestStarted] = useState(false);
  const [sectionCompleted, setSectionCompleted] = useState<boolean[]>(
    () => new Array(sections.length).fill(false)
  );
  const [sectionChangeRequested, setSectionChangeRequested] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const currentTimeLeftRef = useRef((sections[0]?.duration ?? 0) * 60);
  const submitRef = useRef<(autoSubmission: AutoSubmissionMeta) => void>(
    () => undefined
  );

  const getSectionDurationSeconds = useCallback(
    (sectionIndex: number) => (sections[sectionIndex]?.duration ?? 0) * 60,
    [sections]
  );

  const getSectionStartIndex = useCallback(
    (sectionIndex: number) =>
      sections
        .slice(0, sectionIndex)
        .reduce((total, section) => total + section.questions.length, 0),
    [sections]
  );

  const currentSectionStartIndex = getSectionStartIndex(currentSection);
  const currentGlobalQuestionIndex = currentSectionStartIndex + currentQuestion;
  const currentSectionQuestions = sections[currentSection]?.questions ?? [];
  const currentQuestionData =
    currentSectionQuestions[currentQuestion] ?? fallbackQuestion;

  useEffect(() => {
    if (!testStarted) {
      return;
    }

    setVisitedQuestions((previous) =>
      previous[currentGlobalQuestionIndex]
        ? previous
        : { ...previous, [currentGlobalQuestionIndex]: true }
    );
  }, [currentGlobalQuestionIndex, testStarted]);

  const getQuestionStatus = useCallback(
    (globalQuestionIndex: number): QuestionStatus => {
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
    },
    [answers, markedForReview, visitedQuestions]
  );

  const questionStatuses = useMemo(
    () =>
      currentSectionQuestions.map((_, index) =>
        getQuestionStatus(currentSectionStartIndex + index)
      ),
    [currentSectionQuestions, currentSectionStartIndex, getQuestionStatus]
  );

  const selectedAnswer = answers[currentGlobalQuestionIndex];
  const isCurrentMarkedForReview = Boolean(
    markedForReview[currentGlobalQuestionIndex]
  );

  const startTest = useCallback(() => {
    setCurrentSection(0);
    setCurrentQuestion(0);
    setAnswers({});
    setVisitedQuestions({});
    setMarkedForReview({});
    setSectionCompleted(new Array(sections.length).fill(false));
    setSectionChangeRequested(false);
    setTotalTimeSpent(0);
    currentTimeLeftRef.current = getSectionDurationSeconds(0);
    setTestStarted(true);
  }, [getSectionDurationSeconds, sections.length]);

  const selectAnswer = useCallback(
    (answerId: number) => {
      setAnswers((previous) => ({
        ...previous,
        [currentGlobalQuestionIndex]: answerId,
      }));
    },
    [currentGlobalQuestionIndex]
  );

  const toggleReview = useCallback(() => {
    setMarkedForReview((previous) => ({
      ...previous,
      [currentGlobalQuestionIndex]: !previous[currentGlobalQuestionIndex],
    }));
  }, [currentGlobalQuestionIndex]);

  const navigateToQuestion = useCallback(
    (questionNumber: number) => {
      const nextQuestionIndex = Math.min(
        Math.max(questionNumber - 1, 0),
        Math.max(currentSectionQuestions.length - 1, 0)
      );
      setCurrentQuestion(nextQuestionIndex);
    },
    [currentSectionQuestions.length]
  );

  const nextQuestion = useCallback(() => {
    setCurrentQuestion((previous) =>
      Math.min(currentSectionQuestions.length - 1, previous + 1)
    );
  }, [currentSectionQuestions.length]);

  const previousQuestion = useCallback(() => {
    setCurrentQuestion((previous) => Math.max(0, previous - 1));
  }, []);

  const requestNextSection = useCallback(() => {
    if (currentSection >= sections.length - 1) {
      return;
    }

    setSectionCompleted((previous) => {
      const updated = [...previous];
      updated[currentSection] = true;
      return updated;
    });
    setSectionChangeRequested(true);
  }, [currentSection, sections.length]);

  const cancelSectionChange = useCallback(() => {
    setSectionChangeRequested(false);
  }, []);

  const confirmNextSection = useCallback(() => {
    if (currentSection >= sections.length - 1) {
      return null;
    }

    const timeSpentInCurrentSection = Math.max(
      0,
      getSectionDurationSeconds(currentSection) - currentTimeLeftRef.current
    );

    setTotalTimeSpent((previous) => previous + timeSpentInCurrentSection);

    const nextSection = currentSection + 1;
    setCurrentSection(nextSection);
    setCurrentQuestion(0);
    currentTimeLeftRef.current = getSectionDurationSeconds(nextSection);
    setSectionChangeRequested(false);
    return nextSection;
  }, [currentSection, getSectionDurationSeconds, sections.length]);

  useEffect(() => {
    submitRef.current = (autoSubmission: AutoSubmissionMeta) => {
      const finalTimeSpent = Math.max(
        0,
        totalTimeSpent +
          (getSectionDurationSeconds(currentSection) -
            currentTimeLeftRef.current)
      );
      onComplete(answers, finalTimeSpent, autoSubmission);
    };
  }, [answers, currentSection, getSectionDurationSeconds, onComplete, totalTimeSpent]);

  const submitTest = useCallback((autoSubmission = defaultAutoSubmissionMeta) => {
    submitRef.current(autoSubmission);
  }, []);

  const updateTimeLeft = useCallback((timeLeft: number) => {
    currentTimeLeftRef.current = timeLeft;
  }, []);

  const handleTimeUp = useCallback(
    (autoSubmission = defaultAutoSubmissionMeta) => {
      if (currentSection < sections.length - 1) {
        requestNextSection();
        return;
      }

      submitTest(autoSubmission);
    },
    [currentSection, requestNextSection, sections.length, submitTest]
  );

  return {
    testStarted,
    currentSection,
    currentQuestion,
    currentGlobalQuestionIndex,
    currentSectionQuestions,
    currentQuestionData,
    questionStatuses,
    sectionCompleted,
    sectionChangeRequested,
    answers,
    selectedAnswer,
    isCurrentMarkedForReview,
    totalSections: sections.length,
    isFirstQuestion: currentQuestion === 0,
    isLastQuestionInSection:
      currentQuestion === currentSectionQuestions.length - 1,
    isLastSection: currentSection === sections.length - 1,
    startTest,
    selectAnswer,
    toggleReview,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    requestNextSection,
    confirmNextSection,
    cancelSectionChange,
    updateTimeLeft,
    handleTimeUp,
    submitTest,
  };
}
