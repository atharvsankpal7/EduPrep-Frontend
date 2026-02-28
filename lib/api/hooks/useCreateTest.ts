import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTest } from "@/lib/api/services/test.api";
import { testKeys } from "@/lib/api/query-keys";

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testKeys.all });
    },
  });
};
