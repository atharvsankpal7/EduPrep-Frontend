import { useMutation } from "@tanstack/react-query";
import { createTest } from "@/lib/api/services/test.api";

// ---- Hook ----

export const useCreateTest = () => {
  return useMutation({
    mutationFn: createTest,
  });
};
