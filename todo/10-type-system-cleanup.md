# Task 10 — Type System Cleanup

## Priority: 🟡 Medium
## Estimated Effort: 2–3 hours
## Dependencies: Task 07 (Data Transformation Layer)

---

## Why This Matters

`types/global/interface/test.apiInterface.ts` is a 248-line file that mixes:
- Frontend component types (`TestSection`, `QuestionStatus`)
- Backend API response types (`TestResponse`, `AuthResponse`)
- Backend model interfaces (`IUser`, `ITest`, `ITestResult`)
- Request types (`LoginRequest`, `SubmitTestPayload`)
- Enums (`EducationLevel`, `DifficultyLevel`)
- Internal backend concerns (`IUser.isPasswordCorrect()`, `IUser.generateAccessToken()`)

This creates confusion about which types to use, couples the frontend to backend schema, and makes changes risky.

---

## Principle: Separate API Types from Domain Types

**API types** describe what the server sends and receives. They should mirror the actual API contract.

**Domain types** describe what the frontend components work with. They may differ from API types (after transformation).

```
Backend API Response  →  API Type  →  Transformer  →  Domain Type  →  Component
```

---

## Current Problems

### 1. Backend model interfaces in frontend

```typescript
// user.apiInterface.ts — Lines 32-44
export interface IUser {
  password: string;                                        // ❌ Never on frontend
  refreshToken?: string;                                   // ❌ Never on frontend  
  isPasswordCorrect(password: string): Promise<boolean>;   // ❌ Backend method
  generateAccessToken(): string;                           // ❌ Backend method
  generateRefreshToken(): string;                          // ❌ Backend method
}
```

**Already deleted in Task 01.** Verify it's gone.

### 2. Duplicate/overlapping interfaces for same concept

The file has MULTIPLE interfaces for "test section":
- `TestSection` (line 121) — used in frontend components
- `ITestSection` (line 205) — backend schema
- `ICetSection` (line 243) — CET-specific backend schema

And multiple for "question":
- `Question` (in test-interface.tsx, line 31) — component-level
- `IQuestion` (line 188 of apiInterface) — backend
- Inline type in `TestResponse.sections.questions` — API response

### 3. Types defined inside API service files

`admin.api.ts` defines `Student`, `PaginationInfo`, `StudentsApiResponse`, `FetchStudentsParams` inline instead of in the type system.

### 4. Component-level types that should be centralized

`TestInterface` defines its own `Question` and `Section` interfaces (lines 31-42) that are slightly different from `TestSection` in the types file.

---

## Target Structure

```
types/
  api/                          ← Raw API contract types
    auth.types.ts               ← LoginRequest, RegisterRequest, AuthResponse
    test.types.ts               ← TestResponse (raw), SubmitTestPayload, TCreateTestResponse
    admin.types.ts              ← StudentsApiResponse, FetchStudentsParams
    topic.types.ts              ← CetTopicsResponse
  domain/                       ← Frontend domain types (post-transformation)
    user.ts                     ← User (what the frontend works with)
    test.ts                     ← TestSection, Question, QuestionStatus
    result.ts                   ← TestResultData, SectionResult, QuestionAnalysisItem
    admin.ts                    ← Student, PaginationInfo
  index.ts                      ← Re-exports for convenience
```

---

## Step-by-Step

### Step 1: Create `types/api/` directory

Move raw API response/request types:

**`types/api/auth.types.ts`:**
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  city: string;
  contactNumber: string;
}

export interface AuthResponse {
  statusCode: number;
  data: { user: User };
  message: string;
}
```

**`types/api/test.types.ts`:**
```typescript
// Raw API response — mirrors exactly what the server returns
export interface TestApiResponse {
  test: {
    id?: string;
    _id?: string;
    testName: string;
    totalDuration: number;
    totalQuestions: number;
    sections: {
      sectionName: string;
      sectionDuration: number;
      totalQuestions: number;
      questions: {
        id?: string;
        _id?: string;
        questionText: string;
        options: string[];
        answer: number;
        explanation: string;
      }[];
    }[];
  };
}

export interface SubmitTestPayload { ... }
export interface TCreateTestResponse { ... }
export interface TCreateTestParams { ... }
// etc.
```

### Step 2: Create `types/domain/` directory

Move frontend-facing types:

**`types/domain/test.ts`:**
```typescript
// What the frontend ACTUALLY works with (post-transformation)
export interface TestSection {
  name: string;
  duration: number;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
}

export type QuestionStatus =
  | "notVisited"
  | "visitedUnanswered"
  | "answered"
  | "markedForReview";
```

**`types/domain/result.ts`:**
```typescript
export interface TestResultData {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  invalid: boolean;
  tabSwitches: number;
  autoSubmitted: boolean;
  sectionResults: SectionResult[];
  questionAnalysis: QuestionAnalysisItem[];
}

export interface SectionResult { ... }
export interface QuestionAnalysisItem { ... }
```

### Step 3: Move admin types out of `admin.api.ts`

Extract `Student`, `PaginationInfo`, `FetchStudentsParams` from `lib/api/services/admin.api.ts` into `types/api/admin.types.ts` and `types/domain/admin.ts`.

### Step 4: Remove backend-only types

Delete from the frontend codebase (already started in Task 01):
- `IUser` (with `password`, backend methods)
- `ITest`, `ITestSection`, `ITestResult` (backend schemas)
- `ICompanySpecificTestDetails` (backend internal)
- `DifficultyLevel` enum (backend concern)
- `IQuestion` with `standard` field (backend schema)
- `ICetSection` (backend internal)
- `IDomain`, `ISubject`, `ITopic` (backend entities)

### Step 5: Update all imports

Every file that imports from `@/types/global/interface/test.apiInterface` must be updated to import from the new locations.

### Step 6: Delete old files

Once all imports are migrated:
- Delete `types/global/interface/test.apiInterface.ts`
- Delete `types/global/interface/user.apiInterface.ts`
- Delete `types/global/interface/index.ts`
- Delete `types/global/` directory

---

## Verification

```
[ ] types/api/ directory created with auth, test, admin, topic type files
[ ] types/domain/ directory created with user, test, result, admin type files
[ ] No backend-only types remain (IUser with methods, ITest, DifficultyLevel, etc.)
[ ] Admin types moved out of admin.api.ts service file
[ ] All imports updated — no file imports from old paths
[ ] Old types/global/ directory deleted
[ ] npx next build — must pass cleanly
```
