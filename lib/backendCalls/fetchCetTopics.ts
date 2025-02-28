import axios from "axios";
import { BACKEND_URL } from "../constant";

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

export const fetchCetTopics = async (): Promise<CetTopicsResponse> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/topic/cet`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch CET topics:", error);
    throw new Error("Failed to fetch CET topics");
  }
};