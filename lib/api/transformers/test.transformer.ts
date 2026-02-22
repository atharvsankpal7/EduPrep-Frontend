import type {
    TestResponse,
    TestSection,
    SubmitTestPayload,
} from "@/types/global/interface/test.apiInterface";

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the canonical entity ID from backend objects that may carry
 * either `id` or the Mongo-style `_id`.
 *
 * @throws if neither field is present.
 */
export function resolveId(entity: { id?: string; _id?: string }): string {
    const id = entity.id ?? entity._id;
    if (!id) {
        throw new Error("Entity is missing both `id` and `_id` fields");
    }
    return id;
}

// ────────────────────────────────────────────────────────────────────────────
// API → UI transformers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Transforms the raw API test response into frontend-friendly `TestSection[]`.
 *
 * Intentionally a **pure** function — no React hooks, no side-effects.
 * Can be used inside TanStack Query's `select` or called directly in tests.
 */
export function transformTestSections(response: TestResponse): TestSection[] {
    return response.test.sections.map((section) => ({
        name: section.sectionName,
        duration: section.sectionDuration,
        questions: section.questions.map((q) => ({
            question: q.questionText,
            options: q.options,
            correctAnswer: q.answer,
            id: resolveId(q),
        })),
    }));
}

// ────────────────────────────────────────────────────────────────────────────
// UI → API transformers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Builds the submission payload from the raw test data and the user's
 * answer map.
 *
 * @param testData       – original API response (raw shape)
 * @param answers        – map of globalQuestionIndex → zero-based option index
 * @param timeTaken      – total time spent in seconds
 * @param autoSubmission – proctoring metadata
 */
export function buildSubmissionPayload(
    testData: TestResponse,
    answers: Record<number, number>,
    timeTaken: number,
    autoSubmission: { isAutoSubmitted: boolean; tabSwitches: number },
): SubmitTestPayload {
    const selectedAnswers: SubmitTestPayload["selectedAnswers"] = [];
    let globalIndex = 0;

    for (const section of testData.test.sections) {
        for (const question of section.questions) {
            const selectedOption = answers[globalIndex];
            selectedAnswers.push({
                questionId: resolveId(question),
                // API expects 1-based index; -1 means "unanswered"
                selectedOption:
                    selectedOption !== undefined ? selectedOption + 1 : -1,
                sectionName: section.sectionName,
            });
            globalIndex++;
        }
    }

    return {
        selectedAnswers,
        timeTaken,
        autoSubmission,
    };
}
