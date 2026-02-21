import { create } from "zustand";

interface TestState {
  tabSwitchCount: number;
  answers: Record<number, number>;
  isSubmitted: boolean;
  score: number | null;
  sectionScores: Record<string, number>;
  incrementTabSwitches: () => void;
  submitTest: () => void;
  setAnswers: (answers: Record<number, number>) => void;
  setScore: (score: number) => void;
  setSectionScore: (sectionName: string, score: number) => void;
  reset: () => void;
}

const initialState = {
  tabSwitchCount: 0,
  answers: {},
  isSubmitted: false,
  score: null,
  sectionScores: {},
};

export const useTestStore = create<TestState>((set) => ({
  ...initialState,

  incrementTabSwitches: () => {
    set((state) => ({
      tabSwitchCount: state.tabSwitchCount + 1,
      isSubmitted: state.tabSwitchCount >= 2,
    }));
  },

  submitTest: () => {
    set({ isSubmitted: true });
  },

  setAnswers: (answers) => {
    set({ answers });
  },

  setScore: (score) => {
    set({ score });
  },

  setSectionScore: (sectionName, score) => {
    set((state) => ({
      sectionScores: {
        ...state.sectionScores,
        [sectionName]: score,
      },
    }));
  },

  reset: () => {
    set(initialState);
  },
}));