import { useQuery } from "@tanstack/react-query";
import { fetchCetTopics } from "@/lib/api/services/topic.api";
import { topicKeys } from "@/lib/api/query-keys";

export const useCetTopics = () => {
  return useQuery({
    queryKey: topicKeys.cet(),
    queryFn: fetchCetTopics,
    staleTime: 5 * 60 * 1000,
  });
};
