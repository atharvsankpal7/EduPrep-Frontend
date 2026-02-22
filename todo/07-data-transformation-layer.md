# Task 07 — Data Transformation Layer

## Priority: 🟡 Medium
## Estimated Effort: 2–3 hours
## Dependencies: Task 05 (Query Key Factory)

---

## Why This Matters

Backend API responses have a different shape than what the frontend components need. Currently, this transformation happens:
- Inline in page components (`app/test/[...id]/page.tsx` — mapping sections)
- In `useMemo` hooks (`app/result/[...id]/page.tsx` — computing section scores)
- Nowhere at all (raw backend types used directly)

This creates:
- Duplicated transformation logic
- Components coupled to backend response shapes
- No single place to adapt when the API changes

---

## Current Transformation Points

### 1. Test Detail Transform — `app/test/[...id]/page.tsx` (lines 83-92)

```tsx
const sections: TestSection[] = testData.test.sections.map((section) => ({
  name: section.sectionName,
  duration: section.sectionDuration,
  questions: section.questions.map((q) => ({
    question: q.questionText,
    options: q.options,
    correctAnswer: q.answer,
    id: q.id ?? q._id ?? "",
  })),
}));
```

**Problems:**
- Lives in a component (not reusable)
- The comment says "memoize" but there's no `useMemo` wrapping
- `q.id ?? q._id ?? ""` — the dual-ID fallback pattern repeated

### 2. Test Result Transform — `app/result/[...id]/page.tsx` (lines 22-39)

```tsx
const result = useMemo<TestResultData | null>(() => {
  if (!rawResult) return null;
  const sectionResults = rawResult.sectionResults?.map((section: any) => ({
    name: section.sectionName,
    totalQuestions: section.totalQuestions,
    correctAnswers: section.correctAnswers,
    score: (section.correctAnswers / section.totalQuestions) * 100,
    timeSpent: section.timeSpent,
  })) || [];
  return { ...rawResult, sectionResults, questionAnalysis: rawResult.questionAnalysis || [] };
}, [rawResult]);
```

**Problems:**
- `section: any` — type safety abandoned
- Score calculation (`correctAnswers / totalQuestions * 100`) is business logic in a component
- Same score formula exists in `test-result.tsx` (line 74)

### 3. Submission Payload Construction — `app/test/[...id]/page.tsx` (lines 27-52)

```tsx
const selectedAnswers = [];
let globalQuestionIndex = 0;
testData.test.sections.forEach((section) => {
  section.questions.forEach((question) => {
    // ... manual iteration and construction
  });
});
```

**Problem:** This is a data transformation concern, not a UI concern.

---

## Solution: Create Transformer Functions

### File: `lib/api/transformers/test.transformer.ts`

```typescript
import type { TestResponse, TestSection, SubmitTestPayload } from "@/types/global/interface/test.apiInterface";

/**
 * Resolves the entity ID from backend objects that may use `id` or `_id`.
 */
export function resolveId(entity: { id?: string; _id?: string }): string {
  const id = entity.id ?? entity._id;
  if (!id) throw new Error("Entity missing ID field");
  return id;
}

/**
 * Transforms raw API test response into frontend-friendly section format.
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

/**
 * Builds the submission payload from test data and user answers.
 */
export function buildSubmissionPayload(
  testData: TestResponse,
  answers: Record<number, number>,
  timeSpent: number,
  autoSubmission: { isAutoSubmitted: boolean; tabSwitches: number }
): SubmitTestPayload {
  const selectedAnswers: SubmitTestPayload["selectedAnswers"] = [];
  let globalIndex = 0;

  for (const section of testData.test.sections) {
    for (const question of section.questions) {
      const selectedOption = answers[globalIndex];
      selectedAnswers.push({
        questionId: resolveId(question),
        selectedOption: selectedOption !== undefined ? selectedOption + 1 : -1,
        sectionName: section.sectionName,
      });
      globalIndex++;
    }
  }

  return {
    selectedAnswers,
    timeTaken: timeSpent,
    autoSubmission,
  };
}
```

### File: `lib/api/transformers/result.transformer.ts`

```typescript
import type { TestResultData, SectionResult } from "@/types/global/interface/test.apiInterface";

/**
 * Computes score percentage.
 */
export function computeScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return (correct / total) * 100;
}

/**
 * Transforms raw test result API response into frontend model.
 */
export function transformTestResult(rawResult: any): TestResultData {
  const sectionResults: SectionResult[] =
    rawResult.sectionResults?.map((section: any) => ({
      name: section.sectionName,
      totalQuestions: section.totalQuestions,
      correctAnswers: section.correctAnswers,
      score: computeScore(section.correctAnswers, section.totalQuestions),
      timeSpent: section.timeSpent,
    })) ?? [];

  return {
    id: rawResult.id ?? rawResult._id,
    totalQuestions: rawResult.totalQuestions,
    correctAnswers: rawResult.correctAnswers,
    timeSpent: rawResult.timeSpent,
    invalid: rawResult.invalid ?? false,
    tabSwitches: rawResult.tabSwitches ?? 0,
    autoSubmitted: rawResult.autoSubmitted ?? false,
    sectionResults,
    questionAnalysis: rawResult.questionAnalysis ?? [],
  };
}
```

---

## Step 2: Use `select` in Query Hooks

TanStack Query's `select` option is the perfect place for transformations. It:
- Runs only when data changes (automatic memoization)
- Keeps the raw response in cache (enables cache sharing)
- Colocates transformation with the query

### Update `useTestById`:
```typescript
export const useTestById = (testId: string) => {
  return useQuery({
    queryKey: queryKeys.tests.detail(testId),
    queryFn: () => fetchTestById(testId),
    select: (data) => ({
      ...data,
      sections: transformTestSections(data),
    }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
```

### Update `useTestResult`:
```typescript
export const useTestResult = (resultId: string) => {
  return useQuery({
    queryKey: queryKeys.tests.result(resultId),
    queryFn: () => fetchTestResultById(resultId),
    select: transformTestResult,
    staleTime: 5 * 60 * 1000,
  });
};
```

---

## Step 3: Simplify Page Components

### `app/test/[...id]/page.tsx` — BEFORE:
```tsx
// 20+ lines of inline transformation and payload construction
const sections = testData.test.sections.map(...)
const handleTestComplete = async (...) => {
  const selectedAnswers = [];
  let globalIndex = 0;
  testData.test.sections.forEach(...);
  await submitTestById(testId, { selectedAnswers, ... });
};
```

### `app/test/[...id]/page.tsx` — AFTER:
```tsx
import { useTestById } from "@/lib/api/hooks/useTest";
import { useSubmitTest } from "@/lib/api/hooks/useSubmitTest";
import { buildSubmissionPayload } from "@/lib/api/transformers/test.transformer";

export default function TestPage({ params }: TestPageProps) {
  const testId = params.id;
  const router = useRouter();
  const { data: testData, error, isLoading } = useTestById(testId);
  const submitMutation = useSubmitTest();

  const handleTestComplete = (answers: Record<number, number>, timeSpent: number) => {
    if (!testData) return;
    const payload = buildSubmissionPayload(testData, answers, timeSpent, {
      isAutoSubmitted: false,
      tabSwitches: 0,
    });
    submitMutation.mutate({ testId, payload }, {
      onSuccess: (response) => {
        const resultId = response?.data?.testResult?.id ?? response?.data?.testResult?._id;
        if (resultId) router.push(`/result/${resultId}`);
      },
    });
  };

  // ... render
}
```

### `app/result/[...id]/page.tsx` — AFTER:
```tsx
import { useTestResult } from "@/lib/api/hooks/useTestResult";

export default function TestResultPage({ params }) {
  const { data: result, error, isLoading } = useTestResult(params.id);
  // result is already transformed — no useMemo needed
  // ... render
}
```

---

## Files to Create/Modify

| File | Action |
|---|---|
| `lib/api/transformers/test.transformer.ts` | **CREATE** |
| `lib/api/transformers/result.transformer.ts` | **CREATE** |
| `lib/api/hooks/useTest.ts` | **MODIFY** — add `select` |
| `lib/api/hooks/useTestResult.ts` | **MODIFY** — add `select` |
| `app/test/[...id]/page.tsx` | **MODIFY** — remove inline transforms |
| `app/result/[...id]/page.tsx` | **MODIFY** — remove `useMemo` transform |

---

## Verification

```
[ ] test.transformer.ts created with resolveId, transformTestSections, buildSubmissionPayload
[ ] result.transformer.ts created with computeScore, transformTestResult  
[ ] Query hooks use `select` for transformations
[ ] No data transformation logic remains in page components
[ ] Score calculation exists in ONE place (computeScore)
[ ] id ?? _id pattern exists in ONE place (resolveId)
[ ] npx next build — must pass cleanly
```
