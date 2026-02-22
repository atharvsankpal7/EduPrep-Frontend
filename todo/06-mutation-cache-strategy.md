# Task 06 — Mutation Cache Invalidation Strategy

## Priority: 🟠 High
## Estimated Effort: 2 hours
## Dependencies: Task 05 (Query Key Factory)

---

## Why This Matters

Currently, mutations have no cache coordination:
- `useCreateTest` creates a test but doesn't update any cache
- `submitTestById` is called as a raw `async` function, not via `useMutation`
- After login, no queries are invalidated (user-specific data may be stale)
- After logout, cached data for the previous user remains in the cache

This means navigating back after a mutation shows stale data, and user switches can leak data across sessions.

---

## Mutation Inventory

### 1. Test Submission — NOT USING `useMutation`

**Current (in `app/test/[...id]/page.tsx`):**
```tsx
const handleTestComplete = async (answers, timeSpent) => {
  try {
    const response = await submitTestById(testId, { ... });
    router.push(`/result/${testResultId}`);
  } catch (error) {
    console.error("Failed to submit test:", error);
  }
};
```

**Problems:**
- No loading state — user can double-submit
- No error recovery UI
- No cache invalidation
- Console.error is not user-facing feedback

**Fix — Create `useSubmitTest` hook:**

**File:** `lib/api/hooks/useSubmitTest.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { submitTestById } from "@/lib/api/services/test.api";
import type { SubmitTestPayload } from "@/types/global/interface/test.apiInterface";

interface SubmitTestParams {
  testId: string;
  payload: SubmitTestPayload;
}

export const useSubmitTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testId, payload }: SubmitTestParams) =>
      submitTestById(testId, payload),
    onSuccess: (_, variables) => {
      // Remove the test detail from cache — it's completed
      queryClient.removeQueries({
        queryKey: queryKeys.tests.detail(variables.testId),
      });
      // Invalidate any test list caches
      queryClient.invalidateQueries({
        queryKey: queryKeys.tests.all,
      });
    },
  });
};
```

**Usage in page:**
```tsx
const submitMutation = useSubmitTest();

const handleTestComplete = (answers, timeSpent) => {
  // ... build payload ...
  submitMutation.mutate(
    { testId, payload },
    {
      onSuccess: (response) => {
        const testResultId = response?.data?.testResult?.id ?? response?.data?.testResult?._id;
        if (testResultId) {
          router.push(`/result/${testResultId}`);
        }
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "Failed to submit test. Please try again.",
          variant: "destructive",
        });
      },
    }
  );
};
```

**Bonus:** Pass `submitMutation.isPending` to the UI to disable the submit button and show a loading state.

---

### 2. Test Creation — ALREADY USES `useMutation` BUT NO INVALIDATION

**Current `useCreateTest`:**
```typescript
export const useCreateTest = () => {
  return useMutation({
    mutationFn: createTest,
  });
};
```

**Already fixed in Task 05** — added `queryClient.invalidateQueries`. Just verify it's in place.

---

### 3. Login / Register — NEEDS CACHE RESET

**Current `useLogin`:**
```typescript
onSuccess: (data) => {
  login(data.data.user);  // sets Zustand store
},
```

**Problem:** After login, queries from a previous user session might still be in cache. If user A logs out and user B logs in, user A's test results could briefly appear.

**Fix:**
```typescript
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.clear();  // Wipe ALL cached data — new session
      login(data.data.user);
    },
  });
};
```

---

### 4. Logout — NEEDS CACHE CLEAR

**Current `useLogout`:**
```typescript
onSuccess: () => {
  logout();
  router.push("/sign-in");
},
onError: () => {
  logout();
  router.push("/sign-in");
},
```

**Fix:**
```typescript
export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      // On both success and error: clear cache and redirect
      queryClient.clear();
      logout();
      router.push("/sign-in");
    },
  });
};
```

Using `onSettled` instead of duplicating in `onSuccess` + `onError`.

---

### 5. Question Upload (Admin) — SHOULD INVALIDATE

**File:** `lib/api/services/question.api.ts`

Currently a raw API function. If admin uploads questions, topic caches should be invalidated.

**Create `useUploadQuestions` hook:**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { uploadQuestionFile } from "@/lib/api/services/question.api";

export const useUploadQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadQuestionFile,
    onSuccess: () => {
      // New questions may affect available topics
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    },
  });
};
```

---

## Files to Create/Modify

| File | Action |
|---|---|
| `lib/api/hooks/useSubmitTest.ts` | **CREATE** |
| `lib/api/hooks/useUploadQuestions.ts` | **CREATE** |
| `lib/api/hooks/useAuth.ts` | **MODIFY** — add `queryClient.clear()` to login/logout |
| `app/test/[...id]/page.tsx` | **MODIFY** — use `useSubmitTest` hook |

---

## Verification

```
[ ] useSubmitTest hook created, used in test page
[ ] Submit button disabled while submitMutation.isPending
[ ] Login clears query cache
[ ] Logout clears query cache (in onSettled)
[ ] useUploadQuestions created with topic invalidation
[ ] No raw async API calls remain in components (all go through useMutation hooks)
[ ] npx next build — must pass cleanly
```
