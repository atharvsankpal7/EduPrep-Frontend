"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { submitTestById } from "@/lib/api/services/test.api";

type SubmitTestPayload = Parameters<typeof submitTestById>[1];
type SubmitTestResponse = Awaited<ReturnType<typeof submitTestById>>;

interface SubmitTestInput {
    testId: string;
    payload: SubmitTestPayload;
}

interface SubmitResponseData {
    data: {
        testResult?: { id: string };
        resultData?: Record<string, unknown>;
    };
}

const extractSubmitData = (response: SubmitTestResponse) => {
    const data = (response as SubmitResponseData)?.data;
    return {
        resultId: data?.testResult?.id ?? null,
        resultData: data?.resultData ?? null,
    };
};

export const useSubmitTest = () => {
    const queryClient = useQueryClient();

    return useMutation<SubmitTestResponse, Error, SubmitTestInput>({
        mutationFn: ({ testId, payload }) => submitTestById(testId, payload),
        onSuccess: (response, { testId }) => {
            queryClient.removeQueries({
                queryKey: queryKeys.tests.detail(testId),
                exact: true,
            });

            const { resultId, resultData } = extractSubmitData(response);

            if (!resultId) {
                return;
            }

            // Seed result cache so the result page skips a fetch
            if (resultData) {
                queryClient.setQueryData(
                    queryKeys.tests.result(resultId),
                    resultData,
                );
            }
        },
    });
};
