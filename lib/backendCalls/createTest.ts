import axios from "axios";
import { EducationLevel, TopicList } from "../type";

interface CreateTestRequest {
  topics: string[];
  numberOfQuestions: number;
  company: string;
}

interface CreateTestResponse {
  testId: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export const createTest = async ({
  educationLevel,
  topics,
  numberOfQuestions = 30,
  company,
  topicList,
}: {
  educationLevel: EducationLevel;
  topics?: string[];
  numberOfQuestions?: number;
  company?: string;
  topicList?: TopicList;
}): Promise<CreateTestResponse> => {
  console.log(educationLevel, topics, numberOfQuestions, company, topicList);
  try {
    let response;
    if (educationLevel === EducationLevel.JuniorCollege) {
      response = await axios.post<CreateTestResponse>(
        "/api/test/undergraduate/create/custom",
        {
          topics,
          numberOfQuestions,
          company,
          topicList,
        } as CreateTestRequest
      );
    } else {
      response = await axios.post<CreateTestResponse>(
        "/api/tests/juniorCollege/create",
        {
          topics,
          numberOfQuestions,
        } as CreateTestRequest
      );
    }

    return response.data;
  } catch (error) {
    throw new Error("Failed to create test");
  }
};
