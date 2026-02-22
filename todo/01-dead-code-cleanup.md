# Task 01 — Dead Code Cleanup

## Priority: 🔴 Critical
## Estimated Effort: 1–2 hours
## Dependencies: None

---

## Why This Matters

Dead code creates cognitive overhead, misleads developers about what's "in use," and inflates the bundle. This codebase has significant dead code that was left behind during iterative development. Cleaning it up is the safest, highest-signal first step before any structural work.

---

## Dead Code Inventory

### 1. `components/test/test-info.tsx` — ENTIRE FILE IS DEAD

**What it is:** A component called `GateTestPage` (misleadingly named — it's not a page, it's in `components/`). Contains 112 lines of hardcoded demo questions and a UI for starting a demo test.

**Why it's dead:** The actual GATE test page lives at `app/test/undergraduate/gate/page.tsx`. This component is never imported by any route. The `TestInterface` invocation inside it is **commented out** (lines 118-127) and replaced with `<div>Hello</div>`.

**Action:** Delete `components/test/test-info.tsx` entirely.

**Verification:** Run `grep -r "test-info" --include="*.ts" --include="*.tsx"` in the project root. If no imports reference it, safe to delete.

---

### 2. `lib/stores/test-store.ts` — ENTIRELY UNUSED BY THE TEST ENGINE

**What it is:** A Zustand store tracking `tabSwitchCount`, `answers`, `isSubmitted`, `score`, `sectionScores`.

**Why it's dead:** The actual `TestInterface` component manages ALL of this state internally via `useState`:
- `answers` → `useState<Record<number, number>>({})` (line 59 of test-interface.tsx)
- `tabSwitchCount` → `sessionTabSwitchCount` via `useState(0)` (line 72)
- `isSubmitted` → `isAutoSubmitted` via `useState(false)` (line 75)
- `score` → never tracked by the component, delegated to result page

The store is only imported by `use-tab-warning.ts`, which is itself dead code (see item 3).

**Action:** Delete `lib/stores/test-store.ts`.

**Verification:** Run `grep -r "test-store" --include="*.ts" --include="*.tsx"`. Expected: only `use-tab-warning.ts` imports it (which is also being deleted).

---

### 3. `components/test/hooks/use-tab-warning.ts` — DEAD HOOK

**What it is:** A hook that listens for visibility changes and calls `useTestStore.incrementTabSwitches`.

**Why it's dead:** `TestInterface` (the actual runtime component) implements this exact logic inline in its own `useEffect` (lines 130-168 of test-interface.tsx). This hook is never imported by `TestInterface` or any other component.

**Action:** Delete `components/test/hooks/use-tab-warning.ts`.

**Verification:** `grep -r "use-tab-warning" --include="*.ts" --include="*.tsx"`. Expected: zero imports.

---

### 4. `components/test/hooks/use-fullscreen.ts` — DEAD HOOK

**What it is:** A comprehensive fullscreen management hook with `enterFullscreen`, `exitFullscreen`, `toggleFullscreen`, and cross-browser support.

**Why it's dead:** `TestInterface` implements its own fullscreen logic inline in its `useEffect` (lines 89-116 of test-interface.tsx). This hook is never imported.

**Important note:** This hook is actually BETTER than the inline implementation (it handles more browser prefixes and has proper state tracking). In Task 03 (Extract `useProctoring`), we will reintroduce this logic properly. For now, we just need to verify it's unused and leave it OR delete it — the Task 03 file will specify rewriting it as part of the proctoring hook.

**Action:** Delete `components/test/hooks/use-fullscreen.ts`. (The logic will be rewritten properly in Task 03.)

**Verification:** `grep -r "use-fullscreen" --include="*.ts" --include="*.tsx"`. Expected: zero imports.

---

### 5. `app/test/undergraduate/gate/page.tsx` — CONTAINS COMMENTED-OUT CODE

**What it is:** The GATE test page. Lines 44-51 have a commented-out `TestInterface` usage with an **obsolete interface signature** that doesn't match the current `TestInterface` props (`duration`, `totalQuestions` — these props no longer exist).

**Current broken code:**
```tsx
// <TestInterface
//   testId="gate-demo"
//   testName="GATE Mock Test"
//   duration={180 * 60}       ← this prop doesn't exist
//   totalQuestions={65}        ← this prop doesn't exist
//   questions={gateQuestions}  ← this prop doesn't exist
//   onComplete={handleTestComplete}
// />
<div>
  <h1>Test Interface</h1>
</div>
```

**Action:** Delete the commented-out code. The `<div><h1>Test Interface</h1></div>` placeholder should either be replaced with a proper implementation or a clear TODO comment explaining the gap.

---

### 6. `components/navbar.tsx` — COMMENTED-OUT WRAPPER DIV

Lines 42 and 144:
```tsx
{/* <div className=" w-full"> */}
...
{/* </div> */}
```

**Action:** Remove these commented-out lines.

---

### 7. `components/test/test-result.tsx` — COMMENTED-OUT TAB TRIGGER

Lines 59-61:
```tsx
{/* <TabsTrigger value="sections" disabled={sectionResults.length === 0}>
  Section-wise Results
</TabsTrigger> */}
```

**Action:** Either fully implement the sections tab or remove the dead `<TabsContent value="sections">` block (lines 100-137) along with the commented trigger. The sections tab content is fully rendered but completely inaccessible because its trigger is commented out.

---

### 8. `test-interface.tsx` — UNUSED PROP `testId`

Line 52:
```tsx
export function TestInterface({
  testId: _testId,  // ← received but immediately discarded
  ...
```

**Action:** Keep the prop in the interface for now (it will be needed in Task 03 for proctoring/submission), but add a comment: `// Used by useProctoring in future refactor`. This is not truly dead — it's premature, which we'll fix in later tasks.

---

### 9. `types/global/interface/user.apiInterface.ts` — BACKEND TYPES LEAKED INTO FRONTEND

Lines 32-44:
```typescript
export interface IUser {
  urn: number;
  email: string;
  fullName: string;
  password: string;              // ← password field on frontend!
  refreshToken?: string;         // ← token field on frontend!
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordCorrect(password: string): Promise<boolean>;  // ← method from backend model!
  generateAccessToken(): string;                           // ← method from backend model!
  generateRefreshToken(): string;                          // ← method from backend model!
}
```

**Why this is dead:** This is a Mongoose/backend model interface. It should never exist in a frontend codebase. No frontend code should ever see `password`, `refreshToken`, or backend methods.

**Action:** Delete the `IUser` interface entirely. The frontend already has its own `User` interface (lines 1-9 of the same file) which is correct.

---

## Execution Checklist

```
[ ] Delete components/test/test-info.tsx
[ ] Delete lib/stores/test-store.ts
[ ] Delete components/test/hooks/use-tab-warning.ts
[ ] Delete components/test/hooks/use-fullscreen.ts
[ ] Clean app/test/undergraduate/gate/page.tsx (remove commented-out TestInterface)
[ ] Clean components/navbar.tsx (remove commented-out div)
[ ] Clean components/test/test-result.tsx (decide: implement sections tab or remove)
[ ] Delete IUser interface from types/global/interface/user.apiInterface.ts
[ ] Run: grep -r "test-info\|test-store\|use-tab-warning\|use-fullscreen\|IUser" --include="*.ts" --include="*.tsx" to confirm no remaining imports
[ ] Run: npx next build — must pass cleanly
```

---

## What NOT To Do

- Do NOT refactor any working code in this task. Only delete/clean.
- Do NOT reorganize folders yet (that's Task 11).
- Do NOT touch `TestInterface` logic beyond the `_testId` comment (that's Tasks 02-04).
