import { useQuery } from "@tanstack/react-query";
import api from "../axios";

// ---- Types ----

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

// ---- API function ----

const fetchCetTopics = async (): Promise<CetTopicsResponse> => {
  const response = await api.get("/topic/cet");
  return response.data.data;
};

// ---- Hook ----

export const useCetTopics = () => {
  return useQuery({
    queryKey: ["cetTopics"],
    queryFn: fetchCetTopics,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes — topics don't change often
  });
};
