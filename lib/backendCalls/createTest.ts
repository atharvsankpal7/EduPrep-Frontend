import axios from "axios";
import {
  TCreateTestResponse,
  EducationLevel,
  TopicList,
  TUnderGraduateTestCategories,
  TCreateUndergraduateTestRequest,
  TCreateCustomTestRequest,
} from "../type";

export const BACKEND_URL = `http://localhost:5000/api/v1/test`;

const makeRequest = async <T>(url: string, data?: any): Promise<T> => {
  try {
    console.log("Making request to:", url);
    const response = await axios.post<T>(url, data);
    console.log("Response received:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create test: ${error.message}`);
    } else {
      throw new Error("Failed to create test: An unknown error occurred");
    }
  }
};
const getGateTest = (): Promise<TCreateTestResponse> =>
  makeRequest(`${BACKEND_URL}/undergraduate/gate`);

const getCompanySpecificTest = (
  company: string
): Promise<TCreateTestResponse> =>
  makeRequest(`${BACKEND_URL}/undergraduate/companySpecific`, { company });

const getCetTest = (): Promise<TCreateTestResponse> =>
  makeRequest(`${BACKEND_URL}/juniorcollege/cet`);

const getCustomTest = ({
  time,
  numberOfQuestions,
  topicList,
  educationLevel,
}: TCreateCustomTestRequest) =>
  makeRequest(`${BACKEND_URL}/${educationLevel.toLowerCase()}/custom`, {
    time,
    numberOfQuestions,
    topicList,
  });

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

// the backend response is in the format of
// {
//     "statusCode": 201,
//     "data": {
//     "testDetails": {
//         "testId": "6773c7ac1d00a61f44a5c805",
//             "name": "Custom Test 1735641004066",
//             "duration": 180,
//             "totalQuestions": 100
//     }
// },
//     "message": "Test created successfully",
//     "success": true
// }
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
}) => {
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
