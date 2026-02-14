import axios from "axios";
import {
  TCreateTestResponse,
  EducationLevel,
  TopicList,
  TUnderGraduateTestCategories,
  TCreateUndergraduateTestRequest,
  TCreateCustomTestRequest,
  TCreateTestParams,
} from "../type";
import { BACKEND_URL } from "../constant";

const backend_url = BACKEND_URL + "/test";

const makeRequest = async <T>(url: string, data?: unknown): Promise<T> => {
  try {
    console.log("Making request to:", url);
    const response = await axios.post<T>(url, data, {
      withCredentials: true, // This enables sending cookies
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in makeRequest:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create test: ${error.message}`);
    } else {
      throw new Error("Failed to create test: An unknown error occurred");
    }
  }
};

const getGateTest = (): Promise<TCreateTestResponse> =>
  makeRequest(`${backend_url}/undergraduate/gate`);

const getCompanySpecificTest = (
  company: string
): Promise<TCreateTestResponse> =>
  makeRequest(`${backend_url}/undergraduate/companySpecific`, { company });

const getCetTest = (): Promise<TCreateTestResponse> =>
  makeRequest(`${backend_url}/juniorcollege/cet`);

const getCustomTest = ({
  time,
  numberOfQuestions,
  topicList,
  educationLevel,
}: TCreateCustomTestRequest) => {
  const topicNames = topicList.subjects.flatMap((subject) => subject.topics);

  return makeRequest(`${backend_url}/${educationLevel.toLowerCase()}/custom`, {
    time,
    numberOfQuestions,
    topicList: topicNames,
  });
};

const createUndergraduateTest = async ({
  numberOfQuestions = 30,
  category,
  topicList,
  company,
  educationLevel,
  time,
}: TCreateUndergraduateTestRequest) => {
  switch (category) {
    case TUnderGraduateTestCategories.GATE:
      return getGateTest();
    case TUnderGraduateTestCategories.COMPANY_SPECIFIC:
      if (!company)
        throw new Error("Company is required for company specific test");
      return getCompanySpecificTest(company);
    case TUnderGraduateTestCategories.CUSTOM:
      if (!topicList) throw new Error("Topic list is required for custom test");
      if (time === undefined)
        throw new Error("Time is required for custom test");
      return getCustomTest({
        time,
        numberOfQuestions,
        topicList,
        educationLevel,
      });
    default:
      throw new Error("Invalid test category");
  }
};

export const createTest = async ({
  educationLevel,
  numberOfQuestions = 30,
  company,
  topicList,
  time = 60,
  isCet = false,
}: TCreateTestParams) => {
  try {
    console.log("Creating test with params:", { educationLevel, numberOfQuestions, company, topicList, time, isCet });
    
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
  } catch (error) {
    console.error("Error in createTest:", error);
    throw error;
  }
};
