import type {
    TestResultData,
    SectionResult,
    QuestionAnalysisItem,
} from "@/types/global/interface/test.apiInterface";

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Computes a score percentage.
 *
 * Returns `0` when `total` is zero to avoid `NaN` / `Infinity`.
 */
export function computeScore(correct: number, total: number): number {
    if (total === 0) return 0;
    return (correct / total) * 100;
}

// ────────────────────────────────────────────────────────────────────────────
// Raw API response shape (backend contract)
// ────────────────────────────────────────────────────────────────────────────

/** Shape the backend actually returns — only used inside this transformer. */
interface RawSectionResult {
    sectionName: string;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
}

interface RawTestResult {
    id?: string;
    _id?: string;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    invalid?: boolean;
    tabSwitches?: number;
    autoSubmitted?: boolean;
    sectionResults?: RawSectionResult[];
    questionAnalysis?: QuestionAnalysisItem[];
}

// ────────────────────────────────────────────────────────────────────────────
// Transformer
// ────────────────────────────────────────────────────────────────────────────

/**
 * Transforms the raw test-result API response into the frontend
 * `TestResultData` model.
 *
 * Pure function — suitable for TanStack Query `select` or direct invocation.
 */
export function transformTestResult(raw: RawTestResult): TestResultData {
    const sectionResults: SectionResult[] =
        raw.sectionResults?.map((section) => ({
            name: section.sectionName,
            totalQuestions: section.totalQuestions,
            correctAnswers: section.correctAnswers,
            score: computeScore(section.correctAnswers, section.totalQuestions),
            timeSpent: section.timeSpent,
        })) ?? [];

    return {
        id: raw.id ?? raw._id ?? "",
        totalQuestions: raw.totalQuestions,
        correctAnswers: raw.correctAnswers,
        timeSpent: raw.timeSpent,
        invalid: raw.invalid ?? false,
        tabSwitches: raw.tabSwitches ?? 0,
        autoSubmitted: raw.autoSubmitted ?? false,
        sectionResults,
        questionAnalysis: raw.questionAnalysis ?? [],
    };
}
