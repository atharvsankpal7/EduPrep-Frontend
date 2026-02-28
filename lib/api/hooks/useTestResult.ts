"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchTestResultById } from "@/lib/api/services/test.api";
import { transformTestResult } from "@/lib/api/transformers/result.transformer";

type RawTestResult = Parameters<typeof transformTestResult>[0];
type TransformedTestResult = ReturnType<typeof transformTestResult>;

const RESULT_STALE_TIME = 5 * 60 * 1000;
const RESULT_GC_TIME = 30 * 60 * 1000;

export const useTestResult = (resultId: string) => {
    const normalizedResultId = resultId.trim();
    const isEnabled = normalizedResultId.length > 0;

    return useQuery<RawTestResult, Error, TransformedTestResult>({
        queryKey: queryKeys.tests.result(normalizedResultId),
        queryFn: async () => fetchTestResultById(normalizedResultId),
        enabled: isEnabled,
        select: transformTestResult,
        staleTime: RESULT_STALE_TIME,
        gcTime: RESULT_GC_TIME,
    });
};
