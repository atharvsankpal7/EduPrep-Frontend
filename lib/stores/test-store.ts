"use client";

import { create } from 'zustand';

interface TestState {
  tabSwitchCount: number;
  answers: Record<number, number>;
  isSubmitted: boolean;
  score: number | null;
  sectionScores: Record<string, number>;
  incrementTabSwitches: () => void;
  submitTest: () => void;
  setAnswers: (answers: Record<number, number>) => void;
  calculateScore: (correctAnswers: Record<number, number>) => void;
  calculateSectionScore: (sectionName: string, sectionAnswers: Record<number, number>, correctAnswers: Record<number, number>) => void;
}

export const useTestStore = create<TestState>((set, get) => ({
  tabSwitchCount: 0,
  answers: {},
  isSubmitted: false,
  score: null,
  sectionScores: {},

  incrementTabSwitches: () => {
    set((state) => ({ 
      tabSwitchCount: state.tabSwitchCount + 1,
      isSubmitted: state.tabSwitchCount >= 2
    }));
  },

  submitTest: () => {
    set({ isSubmitted: true });
  },

  setAnswers: (answers) => {
    set({ answers });
  },

  calculateScore: (correctAnswers) => {
    const { answers } = get();
    const totalQuestions = Object.keys(correctAnswers).length;
    let correct = 0;

    Object.entries(answers).forEach(([questionId, answer]) => {
      if (correctAnswers[parseInt(questionId)] === answer) {
        correct++;
      }
    });

    const percentage = (correct / totalQuestions) * 100;
    set({ score: percentage });
  },

  calculateSectionScore: (sectionName, sectionAnswers, correctAnswers) => {
    const totalQuestions = Object.keys(sectionAnswers).length;
    let correct = 0;

    Object.entries(sectionAnswers).forEach(([questionId, answer]) => {
      if (correctAnswers[parseInt(questionId)] === answer) {
        correct++;
      }
    });

    const percentage = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
    
    set((state) => ({
      sectionScores: {
        ...state.sectionScores,
        [sectionName]: percentage
      }
    }));
  }
}));