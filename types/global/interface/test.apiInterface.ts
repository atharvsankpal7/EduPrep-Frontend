export interface Subject {
  subjectName: string;
  topics: string[];
  topicIds?: string[];
}

export interface TopicList {
  subjects: Subject[];
}

export const EducationLevel = {
  Undergraduate: "undergraduate",
  JuniorCollege: "juniorCollege",
} as const;

export type EducationLevel =
  (typeof EducationLevel)[keyof typeof EducationLevel];

export interface TSubjectList {
  domain: string;
  subjects: Subject[];
}

export interface TCustomizedTestProps {
  onBack: () => void;
  subjects: TSubjectList[];
}

export enum TUnderGraduateTestCategories {
  GATE = "Gate",
  COMPANY_SPECIFIC = "Company Specific",
  CUSTOM = "Custom",
}

export type TCreateTestResponse = {
  testId?: string;
  data?: {
    testDetails?: {
      testId?: string;
    };
  };
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
};

export type TCreateUndergraduateTestRequest = {
  numberOfQuestions?: number;
  category: TUnderGraduateTestCategories;
  topicList?: TopicList;
  company?: string;
  educationLevel: EducationLevel;
  time?: number;
};

export type TCreateCustomTestRequest = {
  time: number;
  numberOfQuestions: number;
  topicList: TopicList;
  educationLevel: EducationLevel;
};

export type CreateCustomTestParams = TCreateCustomTestRequest;

export interface TCreateTestParams {
  educationLevel: EducationLevel;
  numberOfQuestions?: number;
  company?: string;
  topicList?: TopicList;
  time?: number;
  isCet?: boolean;
}

export interface CetTopic {
  topicName: string;
  questionCount: number;
  topicId: string;
}

export interface CetSubjectTopics {
  subject: string;
  standard: number;
  topics: CetTopic[];
}

export interface CetTopicsResponse {
  topicsBySubject: CetSubjectTopics[];
}

export interface TestPageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export interface TestResponse {
  test: {
    id?: string;
    _id?: string;
    testName: string;
    totalDuration: number;
    totalQuestions: number;
    sections: {
      sectionName: string;
      sectionDuration: number;
      totalQuestions: number;
      questions: {
        id?: string;
        _id?: string;
        questionText: string;
        options: string[];
        answer: number;
        explanation: string;
      }[];
    }[];
  };
}

export interface TestSection {
  name: string;
  duration: number;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    id: string;
  }[];
}

export interface SubmitTestPayload {
  selectedAnswers: {
    questionId: string;
    selectedOption: number;
    sectionName: string;
  }[];
  timeTaken: number;
  autoSubmission: {
    isAutoSubmitted: boolean;
    tabSwitches: number;
  };
}

export interface SectionResult {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
}

export interface QuestionAnalysisItem {
  questionText: string;
  options: string[];
  correctOption: number;
  selectedOption: number;
  isCorrect: boolean;
}

export interface TestResultData {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  invalid: boolean;
  tabSwitches: number;
  autoSubmitted: boolean;
  sectionResults?: SectionResult[];
  questionAnalysis?: QuestionAnalysisItem[];
}

export interface IDomain {
  domainName: string;
  educationLevel: string;
}

export interface ISubject {
  subjectName: string;
  domainId: string;
}

export interface ITopic {
  topicName: string;
  subjectId: string;
}

export interface IQuestion {
  id: string;
  topicIds: string[];
  questionText: string;
  options: string[];
  answer: number;
  difficultyLevel?: number;
  explanation?: string;
  standard: number;
}

export enum DifficultyLevel {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

export interface ITestSection {
  sectionName: string;
  sectionDuration: number;
  questions: string[];
  totalQuestions: number;
}

export interface ITest {
  testName: string;
  sections: ITestSection[];
  totalDuration: number;
  totalQuestions: number;
  expiryTime: Date;
  createdBy: string;
}

export interface ITestResult {
  testId: string;
  studentId: string;
  score: number;
  timeTaken: number;
  selectedAnswers: {
    questionId: string;
    selectedOption: number;
  }[];
  autoSubmission: {
    isAutoSubmitted: boolean;
    tabSwitches: number;
  };
}

export interface ICompanySpecificTestDetails {
  companyName: string;
  time: number;
  numberOfQuestions: number;
  topicList: string[];
}

export interface ICetSection {
  name: string;
  duration: number;
  questions: IQuestion[];
}
