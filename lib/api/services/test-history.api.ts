import api from "@/lib/api/axios";
import type {
    TestHistoryFilters,
    TestHistoryResponse,
} from "@/types/global/interface/test-history.interface";

/**
 * Fetch the authenticated student's test history with optional filters.
 */
export const fetchTestHistory = async (
    filters: TestHistoryFilters = {}
): Promise<TestHistoryResponse> => {
    const params: Record<string, string | number> = {};

    if (filters.testType && filters.testType !== "all") {
        params.testType = filters.testType;
    }
    if (filters.search) {
        params.search = filters.search;
    }
    if (filters.page) {
        params.page = filters.page;
    }
    if (filters.limit) {
        params.limit = filters.limit;
    }
    if (filters.sortBy) {
        params.sortBy = filters.sortBy;
    }
    if (filters.sortOrder) {
        params.sortOrder = filters.sortOrder;
    }

    const response = await api.get("/test-history", { params });
    return response.data.data;
};
