import api from "@/lib/api/axios";
import type { CetTopicsResponse } from "@/types/global/interface/test.apiInterface";

export const fetchCetTopics = async (): Promise<CetTopicsResponse> => {
  const response = await api.get("/topic/cet");
  return response.data.data;
};
