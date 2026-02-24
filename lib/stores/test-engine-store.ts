import { create } from "zustand";

interface ViolationResult {
  counted: boolean;
  strikes: number;
  autoSubmit: boolean;
}

interface TestEngineStoreState {
  sessionId: string | null;
  started: boolean;
  submitted: boolean;
  controlsLocked: boolean;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  sectionLocks: boolean[];
  answers: Record<string, number>;
  visited: Record<string, boolean>;
  markedForReview: Record<string, boolean>;
  tabSwitches: number;
  lastViolationAt: number;
  totalActiveSeconds: number;
  initializeSession: (sessionId: string, sectionCount: number) => void;
  resetSession: () => void;
  startSession: () => void;
  setCurrentSection: (sectionIndex: number) => void;
  setCurrentQuestion: (questionIndex: number) => void;
  lockSection: (sectionIndex: number) => void;
  setAnswer: (questionId: string, selectedOption: number) => void;
  markVisited: (questionId: string) => void;
  toggleMarkedForReview: (questionId: string) => void;
  incrementActiveSeconds: () => void;
  registerViolation: (
    timestamp: number,
    cooldownMs: number,
    maxStrikes: number
  ) => ViolationResult;
  setSubmitted: () => void;
}

const createInitialState = (sectionCount: number) => ({
  sessionId: null as string | null,
  started: false,
  submitted: false,
  controlsLocked: false,
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  sectionLocks: Array.from({ length: Math.max(0, sectionCount) }, () => false),
  answers: {} as Record<string, number>,
  visited: {} as Record<string, boolean>,
  markedForReview: {} as Record<string, boolean>,
  tabSwitches: 0,
  lastViolationAt: 0,
  totalActiveSeconds: 0,
});

export const useTestEngineStore = create<TestEngineStoreState>((set, get) => ({
  ...createInitialState(0),

  initializeSession: (sessionId, sectionCount) => {
    const state = get();
    if (state.sessionId === sessionId && state.sectionLocks.length === sectionCount) {
      return;
    }

    set({
      ...createInitialState(sectionCount),
      sessionId,
    });
  },

  resetSession: () => {
    set(createInitialState(0));
  },

  startSession: () => {
    set({
      started: true,
      submitted: false,
      controlsLocked: false,
      tabSwitches: 0,
      lastViolationAt: 0,
      totalActiveSeconds: 0,
    });
  },

  setCurrentSection: (sectionIndex) => {
    const state = get();
    const maxSectionIndex = Math.max(0, state.sectionLocks.length - 1);
    const nextSectionIndex = Math.min(Math.max(sectionIndex, 0), maxSectionIndex);
    set({
      currentSectionIndex: nextSectionIndex,
      currentQuestionIndex: 0,
    });
  },

  setCurrentQuestion: (questionIndex) => {
    set({
      currentQuestionIndex: Math.max(0, questionIndex),
    });
  },

  lockSection: (sectionIndex) => {
    set((state) => {
      if (sectionIndex < 0 || sectionIndex >= state.sectionLocks.length) {
        return state;
      }

      const sectionLocks = [...state.sectionLocks];
      sectionLocks[sectionIndex] = true;

      return {
        sectionLocks,
      };
    });
  },

  setAnswer: (questionId, selectedOption) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: selectedOption,
      },
    }));
  },

  markVisited: (questionId) => {
    set((state) => {
      if (state.visited[questionId]) {
        return state;
      }

      return {
        visited: {
          ...state.visited,
          [questionId]: true,
        },
      };
    });
  },

  toggleMarkedForReview: (questionId) => {
    set((state) => ({
      markedForReview: {
        ...state.markedForReview,
        [questionId]: !state.markedForReview[questionId],
      },
    }));
  },

  incrementActiveSeconds: () => {
    set((state) => {
      if (!state.started || state.submitted) {
        return state;
      }

      return {
        totalActiveSeconds: state.totalActiveSeconds + 1,
      };
    });
  },

  registerViolation: (timestamp, cooldownMs, maxStrikes) => {
    const state = get();

    if (!state.started || state.submitted) {
      return {
        counted: false,
        strikes: state.tabSwitches,
        autoSubmit: false,
      };
    }

    if (timestamp - state.lastViolationAt < cooldownMs) {
      return {
        counted: false,
        strikes: state.tabSwitches,
        autoSubmit: false,
      };
    }

    const strikes = state.tabSwitches + 1;
    const autoSubmit = strikes >= maxStrikes;

    set({
      tabSwitches: strikes,
      lastViolationAt: timestamp,
      controlsLocked: autoSubmit ? true : state.controlsLocked,
    });

    return {
      counted: true,
      strikes,
      autoSubmit,
    };
  },

  setSubmitted: () => {
    set({
      submitted: true,
      controlsLocked: true,
    });
  },
}));
