# Task 05 — Query Key Factory + TanStack Query Architecture

## Priority: 🟠 High
## Estimated Effort: 2–3 hours
## Dependencies: None (can be done in parallel with Tasks 01-04)

---

## Why This Matters

The codebase currently has scattered, inconsistent query keys:
```typescript
["cetTopics"]               // flat, no namespace
["test", testId]            // shallow tuple
["testResult", params.id]   // inconsistent casing
```

There's no way to:
- Invalidate all test-related queries at once
- Ensure key consistency across files
- Prevent accidental key collisions

This task establishes a **single source of truth** for all query keys and restructures the TanStack Query hooks to follow a professional pattern.

---

## Step 1: Create Query Key Factory

**File:** `lib/api/query-keys.ts`

```typescript
export const queryKeys = {
  tests: {
    all: ['tests'] as const,
    detail: (testId: string) => ['tests', 'detail', testId] as const,
    result: (resultId: string) => ['tests', 'result', resultId] as const,
  },
  topics: {
    all: ['topics'] as const,
    cet: () => ['topics', 'cet'] as const,
  },
  admin: {
    all: ['admin'] as const,
    students: (params: Record<string, unknown>) =>
      ['admin', 'students', params] as const,
  },
} as const;
```

**Why `as const`:** Ensures TypeScript infers exact tuple types, enabling proper type narrowing.

**Why hierarchical:** `queryClient.invalidateQueries({ queryKey: queryKeys.tests.all })` will invalidate ALL test queries (detail + result). This is immensely powerful for cache management.

---

## Step 2: Create Dedicated Query Hooks

Currently, queries are defined inline in page components:
```tsx
// app/test/[...id]/page.tsx
const { data, error, isLoading } = useQuery<TestResponse>({
  queryKey: ["test", testId],
  queryFn: () => fetchTestById(testId),
});
```

This should be a reusable hook. Create query hooks alongside the key factory.

**File:** `lib/api/hooks/useTest.ts` (rename from generic to specific)

```typescript
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchTestById } from "@/lib/api/services/test.api";
import type { TestResponse } from "@/types/global/interface/test.apiInterface";

export const useTestById = (testId: string) => {
  return useQuery({
    queryKey: queryKeys.tests.detail(testId),
    queryFn: () => fetchTestById(testId),
    staleTime: Infinity,  // Active test data should NEVER go stale mid-test
    gcTime: 30 * 60 * 1000,  // Keep in cache for 30 min
  });
};
```

**File:** `lib/api/hooks/useTestResult.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchTestResultById } from "@/lib/api/services/test.api";

export const useTestResult = (resultId: string) => {
  return useQuery({
    queryKey: queryKeys.tests.result(resultId),
    queryFn: () => fetchTestResultById(resultId),
    staleTime: 5 * 60 * 1000,  // Results don't change, but 5 min is fine
  });
};
```

---

## Step 3: Update Existing Hooks

### `lib/api/hooks/useCetTopics.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchCetTopics } from "@/lib/api/services/topic.api";

export const useCetTopics = () => {
  return useQuery({
    queryKey: queryKeys.topics.cet(),
    queryFn: fetchCetTopics,
    staleTime: 5 * 60 * 1000,
  });
};
```

### `lib/api/hooks/useCreateTest.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { createTest } from "@/lib/api/services/test.api";

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTest,
    onSuccess: () => {
      // Invalidate test list caches if/when they exist
      queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
    },
  });
};
```

---

## Step 4: Update Page Components to Use Hooks

### `app/test/[...id]/page.tsx`

**Before:**
```tsx
const { data: testData, error, isLoading } = useQuery<TestResponse>({
  queryKey: ["test", testId],
  queryFn: () => fetchTestById(testId),
});
```

**After:**
```tsx
import { useTestById } from "@/lib/api/hooks/useTest";

const { data: testData, error, isLoading } = useTestById(testId);
```

### `app/result/[...id]/page.tsx`

**Before:**
```tsx
const { data: rawResult, error, isLoading } = useQuery({
  queryKey: ["testResult", params.id],
  queryFn: () => fetchTestResultById(params.id),
});
```

**After:**
```tsx
import { useTestResult } from "@/lib/api/hooks/useTestResult";

const { data: rawResult, error, isLoading } = useTestResult(params.id);
```

---

## Step 5: Add `staleTime: Infinity` for Active Test

**Critical insight:** When a student is actively taking a test (on the `test/[...id]` page), the test data should NEVER be refetched. A background refetch during a test would:
- Potentially reset component state
- Waste bandwidth
- Cause jarring UI updates

In `useTestById`:
```typescript
staleTime: Infinity,  // Once fetched, never considered stale
```

This is correct because test content doesn't change after creation.

---

## Step 6: Review Default QueryClient Options

Current defaults in `query-provider.tsx`:
```typescript
queries: {
  retry: 1,
  refetchOnWindowFocus: false,
  staleTime: 60 * 1000,
},
mutations: {
  retry: false,
},
```

**Assessment:**
- `retry: 1` — Good for a test platform
- `refetchOnWindowFocus: false` — Too aggressive globally. This should be `true` (default) for most queries (admin pages, topic lists) and `false` only for test-specific queries
- `staleTime: 60_000` — Reasonable default

**Change:** Remove `refetchOnWindowFocus: false` from the global default. Add it to specific hooks that need it (test-taking hooks).

```typescript
// query-provider.tsx
defaultOptions: {
  queries: {
    retry: 1,
    staleTime: 60 * 1000,
    // refetchOnWindowFocus: true (default, don't override)
  },
  mutations: {
    retry: false,
  },
},
```

Then in test-specific hooks:
```typescript
export const useTestById = (testId: string) => {
  return useQuery({
    queryKey: queryKeys.tests.detail(testId),
    queryFn: () => fetchTestById(testId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,  // Don't refetch during active test
    refetchOnReconnect: false,    // Don't refetch on reconnect during test
  });
};
```

---

## Files to Create/Modify

| File | Action |
|---|---|
| `lib/api/query-keys.ts` | **CREATE** — key factory |
| `lib/api/hooks/useTest.ts` | **CREATE** — test detail query hook |
| `lib/api/hooks/useTestResult.ts` | **CREATE** — test result query hook |
| `lib/api/hooks/useCetTopics.ts` | **MODIFY** — use key factory |
| `lib/api/hooks/useCreateTest.ts` | **MODIFY** — use key factory, add invalidation |
| `components/providers/query-provider.tsx` | **MODIFY** — remove `refetchOnWindowFocus: false` |
| `app/test/[...id]/page.tsx` | **MODIFY** — use `useTestById` hook |
| `app/result/[...id]/page.tsx` | **MODIFY** — use `useTestResult` hook |

---

## Verification

```
[ ] query-keys.ts created with hierarchical factory
[ ] useTestById hook created with staleTime: Infinity
[ ] useTestResult hook created
[ ] useCetTopics updated to use key factory
[ ] useCreateTest updated with cache invalidation
[ ] refetchOnWindowFocus removed from global defaults
[ ] All inline useQuery calls replaced with dedicated hooks
[ ] No raw string array query keys remain in any component
[ ] npx next build — must pass cleanly
```
