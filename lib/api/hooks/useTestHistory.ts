"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchTestHistory } from "@/lib/api/services/test-history.api";
import type {
    TestHistoryFilters,
    TestHistoryResponse,
} from "@/types/global/interface/test-history.interface";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const GC_TIME = 10 * 60 * 1000; // 10 minutes

export const useTestHistory = (filters: TestHistoryFilters = {}) => {
    return useQuery<TestHistoryResponse>({
        queryKey: queryKeys.tests.history(filters),
        queryFn: () => fetchTestHistory(filters),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        placeholderData: keepPreviousData,
    });
};
