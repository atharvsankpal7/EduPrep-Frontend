import api from "@/lib/api/axios";
import {
  CreateCustomTestParams,
  EducationLevel,
  SubmitTestPayload,
  TCreateTestParams,
  TCreateTestResponse,
  TestResponse,
} from "@/types/global/interface/test.apiInterface";



export const createGateTest = async (): Promise<TCreateTestResponse> => {
  const response = await api.post("/test/undergraduate/gate");
  return response.data;
};

export const createCompanyTest = async (
  company: string
): Promise<TCreateTestResponse> => {
  const response = await api.post("/test/undergraduate/companySpecific", {
    company,
  });
  return response.data;
};

export const createCetTest = async (): Promise<TCreateTestResponse> => {
  const response = await api.post("/test/juniorcollege/cet");
  return response.data;
};

export const createCustomTest = async (
  params: CreateCustomTestParams
): Promise<TCreateTestResponse> => {
  const topicNames = params.topicList.subjects.flatMap(
    (subject) => subject.topics
  );
  const response = await api.post(
    `/test/${params.educationLevel.toLowerCase()}/custom`,
    {
      time: params.time,
      numberOfQuestions: params.numberOfQuestions,
      topicList: topicNames,
    }
  );
  return response.data;
};

export const createTest = async (
  params: TCreateTestParams
): Promise<TCreateTestResponse> => {
  const {
    educationLevel,
    numberOfQuestions = 30,
    company,
    topicList,
    time = 60,
    isCet = false,
  } = params;

  if (educationLevel === EducationLevel.Undergraduate) {
    if (company) {
      return createCompanyTest(company);
    }
    if (topicList) {
      return createCustomTest({
        time,
        numberOfQuestions,
        topicList,
        educationLevel,
      });
    }
    return createGateTest();
  }

  if (isCet) {
    return createCetTest();
  }

  if (!topicList) {
    throw new Error("Topic list is required for custom test");
  }

  return createCustomTest({
    numberOfQuestions,
    topicList,
    educationLevel,
    time,
  });
};

export const fetchTestById = async (testId: string): Promise<TestResponse> => {
  const response = await api.get(`/test/${testId}`);
  const responseData = response.data.data;
  if (!responseData.test) {
    throw new Error("Invalid test data received");
  }
  return responseData;
};

export const submitTestById = async (
  testId: string,
  payload: SubmitTestPayload
) => {
  const response = await api.patch(`/test/${testId}/submit`, payload);
  return response.data;
};

export const fetchTestResultById = async (resultId: string) => {
  const response = await api.get(`/test/${resultId}/result`);
  return response.data.data;
};
