import type {
  QuestionAnalysisItem,
  SectionResult,
  TestResultData,
} from "@/types/global/interface/test.apiInterface";

export const computeScore = (correct: number, total: number): number => {
  if (total <= 0) {
    return 0;
  }
  return (correct / total) * 100;
};

interface RawSectionResult {
  sectionName: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
}

export interface RawTestResult {
  id?: string;
  _id?: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  invalid?: boolean;
  tabSwitches?: number;
  autoSubmitted?: boolean;
  sectionResults?: RawSectionResult[];
  questionAnalysis?: QuestionAnalysisItem[];
}

export const transformTestResult = (raw: RawTestResult): TestResultData => {
  const sectionResults: SectionResult[] =
    raw.sectionResults?.map((section) => ({
      name: section.sectionName,
      totalQuestions: section.totalQuestions,
      correctAnswers: section.correctAnswers,
      score: computeScore(section.correctAnswers, section.totalQuestions),
      timeSpent: section.timeSpent,
    })) ?? [];

  return {
    id: raw.id ?? raw._id ?? "",
    totalQuestions: raw.totalQuestions,
    correctAnswers: raw.correctAnswers,
    timeSpent: raw.timeSpent,
    invalid: raw.invalid ?? false,
    tabSwitches: raw.tabSwitches ?? 0,
    autoSubmitted: raw.autoSubmitted ?? false,
    sectionResults,
    questionAnalysis: raw.questionAnalysis ?? [],
  };
};
