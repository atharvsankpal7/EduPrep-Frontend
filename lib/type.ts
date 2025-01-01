interface Subject {
  subjectName: string; // Name of the subject
  topics: string[]; // Topics for this subject
}

export interface TopicList {
  subjects: Subject[]; // List of subjects, each with a name and topics
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
  testId: string;
  questions: Array<{
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



export interface IUser {
  urn: number;
  email: string;
  fullName: string;
  password: string;
  refreshToken?: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;

  isPasswordCorrect(password: string): Promise<boolean>;

  generateAccessToken(): string;

  generateRefreshToken(): string;
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
  topicIds: string[];
  questionText: string;
  options: string[];
  answer: number;
  difficultyLevel?: number;
  explanation?: string;
  standard:number;

}

export enum DifficultyLevel {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

export interface ITest {
  testName: string;
  testDuration: number;
  totalQuestions: number;
  expiryTime: Date;
  testQuestions: string[]; // questionId
  createdBy: string; // userId
}


export interface ITestResult {
  testId: string;
  studentId: string; // the student who gave the test
  score: number;
  timeTaken: number; // in seconds
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