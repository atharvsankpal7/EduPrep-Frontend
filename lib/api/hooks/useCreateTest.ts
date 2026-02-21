import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import {
  TCreateTestResponse,
  EducationLevel,
  TopicList,
  TUnderGraduateTestCategories,
  TCreateTestParams,
} from "../../type";

// ---- API functions ----

const createGateTest = async (): Promise<TCreateTestResponse> => {
  const response = await api.post("/test/undergraduate/gate");
  return response.data;
};

const createCompanyTest = async (company: string): Promise<TCreateTestResponse> => {
  const response = await api.post("/test/undergraduate/companySpecific", { company });
  return response.data;
};

const createCetTest = async (): Promise<TCreateTestResponse> => {
  const response = await api.post("/test/juniorcollege/cet");
  return response.data;
};

const createCustomTest = async (params: {
  time: number;
  numberOfQuestions: number;
  topicList: TopicList;
  educationLevel: EducationLevel;
}): Promise<TCreateTestResponse> => {
  const topicNames = params.topicList.subjects.flatMap((subject) => subject.topics);
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

// ---- Main API function that routes to the correct endpoint ----

const createTestApi = async (params: TCreateTestParams): Promise<TCreateTestResponse> => {
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
      return createCustomTest({ time, numberOfQuestions, topicList, educationLevel });
    }
    return createGateTest();
  }

  if (isCet) return createCetTest();

  if (!topicList) throw new Error("Topic list is required for custom test");
  return createCustomTest({ numberOfQuestions, topicList, educationLevel, time });
};

// ---- Hook ----

export const useCreateTest = () => {
  return useMutation({
    mutationFn: createTestApi,
  });
};
