import axios from "axios";
import {
  EducationLevel,
  TopicList,
  TUnderGraduateTestCategories,
} from "../type";

interface CreateTestResponse {
  testId: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

const BACKEND_URL = `${process.env.BACKEND_URL}/api/test/get`;

const makeRequest = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await axios.post<T>(url, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create test: ${error.message}`);
    } else {
      throw new Error('Failed to create test: An unknown error occurred');
    }
  }
};
const getGateTest = (): Promise<CreateTestResponse> =>
  makeRequest(`${BACKEND_URL}/undergraduate/gate`);

const getCompanySpecificTest = (company: string): Promise<CreateTestResponse> =>
  makeRequest(`${BACKEND_URL}/undergraduate/companySpecific`, { company });

const getCetTest = (): Promise<CreateTestResponse> =>
  makeRequest(`${BACKEND_URL}/juniorcollege/cet`);

const getCustomTest = ({
  time,
  numberOfQuestions,
  topicList,
  educationLevel,
}: {
  time: number;
  numberOfQuestions: number;
  topicList: TopicList;
  educationLevel: EducationLevel;
}): Promise<CreateTestResponse> =>
  makeRequest(
    `${BACKEND_URL}/${educationLevel.toLowerCase()}/custom`,
    { time, numberOfQuestions, topicList }
  );

const createUndergraduateTest = async ({
  numberOfQuestions = 30,
  category,
  topicList,
  company,
  educationLevel,
  time,
}: {
  numberOfQuestions?: number;
  category: TUnderGraduateTestCategories;
  topicList?: TopicList;
  company?: string;
  educationLevel: EducationLevel;
  time?: number;
}): Promise<CreateTestResponse> => {
  switch (category) {
    case TUnderGraduateTestCategories.GATE:
      return getGateTest();
    case TUnderGraduateTestCategories.COMPANY_SPECIFIC:
      if (!company) throw new Error("Company is required for company specific test");
      return getCompanySpecificTest(company);
    case TUnderGraduateTestCategories.CUSTOM:
      if (!topicList) throw new Error("Topic list is required for custom test");
      if (time === undefined) throw new Error("Time is required for custom test");
      return getCustomTest({ time, numberOfQuestions, topicList, educationLevel });
    default:
      throw new Error("Invalid test category");
  }
};

export const createTest = async ({
  educationLevel,
  numberOfQuestions = 30,
  company,
  topicList,
  time = 60 * 60 * 60,
  isCet = false,
}: {
  educationLevel: EducationLevel;
  numberOfQuestions?: number;
  company?: string;
  topicList?: TopicList;
  time?: number;
  isCet?: boolean;
}): Promise<CreateTestResponse> => {
  if (educationLevel === EducationLevel.Undergraduate) {
    const category = company
      ? TUnderGraduateTestCategories.COMPANY_SPECIFIC
      : topicList
      ? TUnderGraduateTestCategories.CUSTOM
      : TUnderGraduateTestCategories.GATE;

    return createUndergraduateTest({
      numberOfQuestions,
      company,
      topicList,
      category,
      educationLevel,
      time,
    });
  }

  if (isCet) return getCetTest();
  
  if (!topicList) throw new Error("Topic list is required for custom test");
  return getCustomTest({ numberOfQuestions, topicList, educationLevel, time });
};