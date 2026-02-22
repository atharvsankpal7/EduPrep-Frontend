import { useQuery } from "@tanstack/react-query";
import { fetchCetTopics } from "@/lib/api/services/topic.api";

// ---- Hook ----

export const useCetTopics = () => {
  return useQuery({
    queryKey: ["cetTopics"],
    queryFn: fetchCetTopics,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes — topics don't change often
  });
};
