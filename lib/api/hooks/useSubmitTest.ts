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

const extractResultId = (response: SubmitTestResponse): string | null => {
    if (!response || typeof response !== "object") {
        return null;
    }

    const data = response as {
        data?: {
            testResult?: {
                id: string;
            };
        };
    };

    const resultId = data.data?.testResult?.id;

    if (!resultId || typeof resultId !== "string") {
        return null;
    }

    return resultId;
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

            const resultId = extractResultId(response);

            if (!resultId) {
                return;
            }

            queryClient.invalidateQueries({
                queryKey: queryKeys.tests.result(resultId),
                exact: true,
            });
        },
    });
};
