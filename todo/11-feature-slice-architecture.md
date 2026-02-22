# Task 11 — Feature Slice Architecture Migration

## Priority: 🟡 Medium
## Estimated Effort: 3–4 hours
## Dependencies: All previous tasks (01–10)

---

## Why This Matters

After tasks 01–10, the code is clean, decomposed, and well-typed — but the folder structure still doesn't reflect the domain boundaries. Files for the same feature are scattered across `components/`, `hooks/`, `lib/api/hooks/`, `lib/api/services/`, and `types/`. 

This task reorganizes the codebase into **feature slices** — self-contained modules where everything related to a feature lives together.

---

## Current Structure (Post Tasks 01–10)

```
app/                            ← Routes (keep as-is)
components/
  common/                       ← Shared UI (RichContent, QueryError, etc.)
  test/                         ← Test UI components
  providers/                    ← App-level providers
  ui/                           ← shadcn components
hooks/
  use-test-engine.ts            ← Test domain hook
  use-proctoring.ts             ← Proctoring domain hook
  use-mobile.tsx                ← UI utility hook
  use-toast.ts                  ← UI utility hook
lib/
  api/
    hooks/                      ← Query/mutation hooks
    services/                   ← API functions
    transformers/               ← Data transformers
    query-keys.ts               ← Key factory
    axios.ts                    ← HTTP client
    errors.ts                   ← Error utilities
  stores/
    auth-store.ts               ← Auth state
  utils.ts, time.ts, constant.ts
types/
  api/                          ← API types
  domain/                       ← Domain types
```

**Problem:** To understand the "test" feature, you need to look in 5+ directories.

---

## Target Structure

```
app/                            ← Routes (UNCHANGED — Next.js requires this)

features/                       ← NEW — domain-organized code
  test-engine/
    hooks/
      use-test-engine.ts
      use-proctoring.ts
    api/
      test.api.ts               ← API service functions
      test.queries.ts           ← TanStack query hooks (useTestById, useSubmitTest, useCreateTest)
    transformers/
      test.transformer.ts
      result.transformer.ts
    components/
      test-interface.tsx
      question-panel.tsx
      question-navigation.tsx
      question-status.ts
      section-info-bar.tsx
      test-footer.tsx
      section-change-dialog.tsx
      submit-confirm-dialog.tsx
      test-header.tsx
      timer.tsx
      warning-modal.tsx
      tab-switch-warning-modal.tsx
      test-result.tsx
      test-result-details.tsx
      result/
        invalid-result.tsx
        question-analysis.tsx
      custom-practice/
        test-config-dialog.tsx
    types/
      test.types.ts             ← domain types for test feature
    index.ts                    ← Public API (barrel export)
  
  auth/
    hooks/
      use-auth.ts               ← useLogin, useRegister, useLogout
    api/
      auth.api.ts
    store/
      auth-store.ts
    components/
      auth-guard.tsx
    types/
      auth.types.ts
    index.ts
  
  admin/
    api/
      admin.api.ts
      admin.queries.ts
    components/
      (admin-specific components)
    types/
      admin.types.ts
    index.ts

  topics/
    api/
      topic.api.ts
      topic.queries.ts
    types/
      topic.types.ts
    index.ts

components/                     ← SHARED UI only (not feature-specific)
  common/
    page-wrapper.tsx
    surface.tsx
    typography.tsx
    sticky-bar.tsx
    rich-content.tsx
    query-error.tsx
    empty-state.tsx
  ui/                           ← shadcn (unchanged)
  providers/
    query-provider.tsx
    theme-provider.tsx
    store-hydration-gate.tsx
  navbar.tsx
  footer.tsx
  loading.tsx
  theme-toggle.tsx

hooks/                          ← SHARED utility hooks only
  use-mobile.tsx
  use-toast.ts

lib/                            ← SHARED infrastructure only
  api/
    axios.ts
    errors.ts
    query-keys.ts               ← imports from features, re-exports unified factory
  utils.ts
  time.ts
  constant.ts

types/                          ← SHARED types only
  api/                          ← cross-feature API types
  domain/                       ← cross-feature domain types
```

---

## Migration Rules

### 1. Feature barrel exports (index.ts)

Each feature has an `index.ts` that explicitly exports its public API:

```typescript
// features/test-engine/index.ts
export { TestInterface } from './components/test-interface';
export { useTestById, useSubmitTest, useCreateTest } from './api/test.queries';
export type { TestSection, Question, QuestionStatus } from './types/test.types';
```

**Rule:** Files outside a feature MUST import through the barrel. Direct deep imports (`features/test-engine/components/question-panel`) are NOT allowed from outside the feature.

### 2. Cross-feature imports go through barrels

```typescript
// CORRECT:
import { useTestById } from '@/features/test-engine';

// WRONG:
import { useTestById } from '@/features/test-engine/api/test.queries';
```

### 3. TSConfig path alias

Add a path alias for features:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/features/*": ["./features/*"]
    }
  }
}
```

### 4. Route files import from features

```typescript
// app/test/[...id]/page.tsx
import { TestInterface } from '@/features/test-engine';
import { useTestById, useSubmitTest } from '@/features/test-engine';
import { buildSubmissionPayload } from '@/features/test-engine';
```

---

## Migration Steps

### Step 1: Create `features/` directory structure

Create the directory tree above. Don't move files yet.

### Step 2: Move test-engine files

Move files from their current locations into `features/test-engine/`:
- `hooks/use-test-engine.ts` → `features/test-engine/hooks/`
- `hooks/use-proctoring.ts` → `features/test-engine/hooks/`
- `lib/api/services/test.api.ts` → `features/test-engine/api/`
- `lib/api/hooks/useTest.ts` → `features/test-engine/api/test.queries.ts`
- `lib/api/hooks/useSubmitTest.ts` → same destination
- `lib/api/hooks/useCreateTest.ts` → same destination
- `lib/api/transformers/test.transformer.ts` → `features/test-engine/transformers/`
- `lib/api/transformers/result.transformer.ts` → same destination
- All `components/test/*` → `features/test-engine/components/`
- Test-related types → `features/test-engine/types/`

### Step 3: Move auth files

- `lib/api/hooks/useAuth.ts` → `features/auth/hooks/use-auth.ts`
- `lib/api/services/auth.api.ts` → `features/auth/api/`
- `lib/stores/auth-store.ts` → `features/auth/store/`
- `components/providers/auth-guard.tsx` → `features/auth/components/`
- Auth types → `features/auth/types/`

### Step 4: Move admin files

- `lib/api/services/admin.api.ts` → `features/admin/api/`
- Admin types → `features/admin/types/`

### Step 5: Move topic files

- `lib/api/services/topic.api.ts` → `features/topics/api/`
- `lib/api/hooks/useCetTopics.ts` → `features/topics/api/topic.queries.ts`
- Topic types → `features/topics/types/`

### Step 6: Create barrel exports

Create `index.ts` for each feature, exporting only the public API.

### Step 7: Update ALL imports

Go through every file in `app/` and update import paths to use feature barrels.

### Step 8: Clean up empty directories

Remove `lib/api/hooks/`, `lib/api/services/`, `lib/api/transformers/`, `lib/stores/`, and `types/global/` if they're now empty.

---

## What Stays in `lib/`

Only shared infrastructure that is feature-agnostic:
- `lib/api/axios.ts` — HTTP client (used by all features)
- `lib/api/errors.ts` — Error utilities
- `lib/api/query-keys.ts` — Aggregated key factory (imports from features)
- `lib/utils.ts` — `cn()`, `debounce()`
- `lib/time.ts` — Time formatting
- `lib/constant.ts` — `BACKEND_URL`

---

## Verification

```
[ ] features/ directory created with test-engine, auth, admin, topics
[ ] All test-related files moved to features/test-engine/
[ ] All auth-related files moved to features/auth/
[ ] Barrel exports (index.ts) created for each feature
[ ] Route files import from feature barrels, not deep paths
[ ] No empty directories remain in old locations
[ ] lib/ only contains shared infrastructure
[ ] components/ only contains shared UI
[ ] TSConfig paths updated
[ ] npx next build — must pass cleanly
```
