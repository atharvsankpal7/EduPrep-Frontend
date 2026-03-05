// ────────────────────────────────────────────────────────────────────────────
// Test History — Domain types for the student dashboard
// ────────────────────────────────────────────────────────────────────────────

export type TestType = "custom" | "cet";

export type TestStatus = "completed" | "submitted" | "auto_submitted";

export interface TestHistoryEntry {
    id: string;
    resultId: string;
    testName: string;
    testType: TestType;
    attemptedAt: string; // ISO 8601
    topics: string[];
    totalQuestions: number;
    correctAnswers: number;
    score: number; // percentage (0-100)
    maxMarks: number;
    marksObtained: number;
    timeTaken: number; // seconds
    totalDuration: number; // seconds
    status: TestStatus;
    educationLevel: string;
}

export interface TestHistoryResponse {
    tests: TestHistoryEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface TestHistoryFilters {
    testType?: TestType | "all";
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: "attemptedAt" | "score" | "timeTaken";
    sortOrder?: "asc" | "desc";
}
