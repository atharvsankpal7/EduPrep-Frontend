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
const getGateTest = async (): Promise<CreateTestResponse> => {
  try {
    const response = await axios.post<CreateTestResponse>(
      `${BACKEND_URL}/undergraduate/gate`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create gate test");
  }
};

const getCompanySpecificTest = async (
  company: string
): Promise<CreateTestResponse> => {
  try {
    const response = await axios.post<CreateTestResponse>(
      `${BACKEND_URL}/undergraduate/companySpecific`,
      {
        company,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      "Failed to create company specific test for company: " + company
    );
  }
};

const getCetTest = async (): Promise<CreateTestResponse> => {
  try {
    const response = await axios.post<CreateTestResponse>(
      `${BACKEND_URL}/juniorcollege/cet`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create cet test");
  }
};

const getCustomTest = async ({
  time,
  numberOfQuestions,
  topicList,
  educationLevel,
}: {
  time: number;
  numberOfQuestions: number;
  topicList: TopicList;
  educationLevel: EducationLevel;
}): Promise<CreateTestResponse> => {
  try {
    const response = await axios.post<CreateTestResponse>(
      `${BACKEND_URL}/${educationLevel.toLocaleLowerCase()}/custom`,
      {
        time,
        numberOfQuestions,
        topicList,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create custom test");
  }
};

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
  if (category === TUnderGraduateTestCategories.GATE) {
    return getGateTest();
  } else if (category === TUnderGraduateTestCategories.COMPANY_SPECIFIC) {
    if (!company) {
      throw new Error("Company is required for company specific test");
    }
    return getCompanySpecificTest(company);
  } else if (category === TUnderGraduateTestCategories.CUSTOM) {
    if (!topicList) {
      throw new Error("Topic list is required for custom test");
    }
    if (time === undefined) {
      throw new Error("Time is required for custom test");
    }
    return getCustomTest({
      time,
      numberOfQuestions,
      topicList,
      educationLevel,
    });
  } else {
    throw new Error("Invalid test category");
  }
};

export const createTest = async ({
  educationLevel,
  numberOfQuestions = 30,
  company,
  topicList,
  time = 60 * 60 * 60, // 1 hour
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
    return createUndergraduateTest({
      numberOfQuestions,
      company,
      topicList,
      category: company
        ? TUnderGraduateTestCategories.COMPANY_SPECIFIC
        : TUnderGraduateTestCategories.CUSTOM,
      educationLevel,
      time,
    });
  } else {
    if (isCet) {
      return getCetTest();
    }
    if (!topicList) {
      throw new Error("Topic list is required for custom test");
    }
    return getCustomTest({
      numberOfQuestions,
      topicList,
      educationLevel,
      time,
    });
  }
};
