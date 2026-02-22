# Task 02 — Extract `useTestEngine` Hook

## Priority: 🔴 Critical
## Estimated Effort: 3–4 hours
## Dependencies: Task 01 (Dead Code Cleanup)

---

## Why This Matters

`TestInterface` is a 513-line god component that owns:
- **Test state machine** (section navigation, answers, visited questions, review marks)
- **Timer logic** (countdown, time tracking across sections)
- **Proctoring** (tab switches, fullscreen, clipboard blocking, context menu blocking)
- **UI rendering** (question display, navigation grid, section tabs, dialogs, sticky bars)

This task extracts the **test state machine** into a dedicated `useTestEngine` hook. After this task, the component will delegate all state logic to the hook and focus purely on rendering.

---

## What `useTestEngine` Should Own

All state and logic related to the test-taking flow:

### State
| State | Current Implementation | New Home |
|---|---|---|
| `currentSection` | `useState(0)` | `useTestEngine` |
| `currentQuestion` | `useState(0)` | `useTestEngine` |
| `answers` | `useState<Record<number, number>>({})` | `useTestEngine` |
| `visitedQuestions` | `useState<Record<number, boolean>>({})` | `useTestEngine` |
| `markedForReview` | `useState<Record<number, boolean>>({})` | `useTestEngine` |
| `sectionCompleted` | `useState<boolean[]>(...)` | `useTestEngine` |
| `totalTimeSpent` | `useState(0)` | `useTestEngine` |
| `testStarted` | `useState(false)` | `useTestEngine` |

### Derived Values
| Value | Current Implementation | New Home |
|---|---|---|
| `currentSectionStartIndex` | Computed inline via `getSectionStartIndex()` | `useTestEngine` (returned as derived) |
| `currentGlobalQuestionIndex` | Computed inline | `useTestEngine` |
| `currentSectionQuestions` | `sections[currentSection].questions` | `useTestEngine` |
| `currentQuestionData` | `currentSectionQuestions[currentQuestion]` | `useTestEngine` |
| `questionStatuses` | `useMemo` computing per-question status | `useTestEngine` |

### Actions (functions the hook returns)
| Action | What It Does |
|---|---|
| `startTest()` | Sets `testStarted = true`, resets all state |
| `selectAnswer(answerId: number)` | Stores answer for current global question |
| `toggleReview()` | Toggles review mark for current question |
| `navigateToQuestion(questionNumber: number)` | Sets `currentQuestion` (1-indexed input) |
| `nextQuestion()` | Advances to next question in section |
| `previousQuestion()` | Goes to previous question in section |
| `moveToNextSection()` | Handles section transition (tracks time spent, resets question index) |
| `submitTest()` | Computes final time, calls `onComplete` callback |
| `getQuestionStatus(globalIndex: number)` | Returns status enum for a question |

### Timer State (IMPORTANT DECISION)

The timer currently lives in `TestInterface` as `timeLeft` state, and is passed to `<Timer>` along with `setTimeLeft`. The `Timer` component runs `setInterval` and calls `setTimeLeft` every second. This causes the ENTIRE `TestInterface` to re-render every second.

**Decision for this task:** Move `timeLeft` into `useTestEngine` but DO NOT fix the re-render issue yet. The hook will return `timeLeft` and `setTimeLeft`. The re-render optimization (isolating the timer into its own render boundary) is a separate concern addressed in Task 04.

**The timer state belongs in the engine because:**
- `timeLeft` is needed for `totalTimeSpent` calculation on section change
- `timeLeft` determines auto-section-advance on time-up
- The engine needs to reset `timeLeft` when advancing sections

---

## Hook Signature

```typescript
// hooks/use-test-engine.ts

interface Section {
  name: string;
  duration: number;   // in minutes
  questions: {
    question: string;
    options: string[];
    correctAnswer?: number;
    id?: string;
  }[];
}

interface UseTestEngineOptions {
  sections: Section[];
  onComplete: (answers: Record<number, number>, timeSpent: number) => void;
}

interface UseTestEngineReturn {
  // State
  testStarted: boolean;
  currentSection: number;
  currentQuestion: number;      // 0-indexed
  currentGlobalQuestionIndex: number;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;

  // Derived
  currentSectionQuestions: Section['questions'];
  currentQuestionData: Section['questions'][number];
  questionStatuses: QuestionStatus[];
  sectionCompleted: boolean[];
  totalSections: number;

  // Answer state
  answers: Record<number, number>;
  selectedAnswer: number | undefined;       // for current question
  isCurrentMarkedForReview: boolean;

  // Actions
  startTest: () => void;
  selectAnswer: (answerId: number) => void;
  toggleReview: () => void;
  navigateToQuestion: (questionNumber: number) => void;  // 1-indexed
  nextQuestion: () => void;
  previousQuestion: () => void;
  requestNextSection: () => void;   // prepares for section change (shows dialog)
  confirmNextSection: () => void;   // actually transitions
  handleTimeUp: () => void;
  submitTest: () => void;

  // UI state helpers
  isFirstQuestion: boolean;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
}
```

---

## File Location

Create: `hooks/use-test-engine.ts`

This goes in the root `hooks/` folder because it's a domain hook (not a UI utility hook and not an API hook). In Task 11 (Feature Slice Architecture) it will be moved to `features/test-engine/hooks/`.

---

## Implementation Steps

### Step 1: Create the hook file

Create `hooks/use-test-engine.ts` with the signature above. Move state declarations from `TestInterface` into the hook.

### Step 2: Move helper functions

Move these from `TestInterface` into the hook:
- `getSectionStartIndex()` — pure computation
- `getQuestionStatus()` — currently a `useCallback`
- `handleAnswer()` → becomes `selectAnswer()`
- `handleToggleReview()` → becomes `toggleReview()`
- `handleQuestionSelect()` → becomes `navigateToQuestion()`
- `handleNextSection()` → split into `requestNextSection()` + `confirmNextSection()`
- `confirmNextSection()` — section transition logic
- `handleTimeUp()` — auto-advance or submit
- `handleStartTest()` → becomes `startTest()`
- `handleSubmit()` → becomes `submitTest()`

### Step 3: Move the `questionStatuses` useMemo

The current `useMemo` in `TestInterface` (lines 309-315):
```tsx
const questionStatuses = useMemo(
  () => currentSectionQuestions.map((_, index) =>
    getQuestionStatus(currentSectionStartIndex + index)
  ),
  [currentSectionQuestions, currentSectionStartIndex, getQuestionStatus]
);
```
Move this into the hook and return it as `questionStatuses`.

### Step 4: Move the visitedQuestions tracking effect

The `useEffect` at lines 205-215:
```tsx
useEffect(() => {
  if (!testStarted) return;
  setVisitedQuestions((previous) =>
    previous[currentGlobalQuestionIndex]
      ? previous
      : { ...previous, [currentGlobalQuestionIndex]: true }
  );
}, [currentGlobalQuestionIndex, testStarted]);
```
Move into the hook.

### Step 5: Move the handleSubmitRef pattern

The `ref` + `useEffect` pattern at lines 77, 118-128 that keeps the submit function reference current:
```tsx
const handleSubmitRef = useRef<() => void>(() => undefined);
useEffect(() => {
  handleSubmitRef.current = () => { /* ... */ };
}, [answers, currentSection, onComplete, sections, timeLeft, totalTimeSpent]);
```
Move this into the hook. The hook internally manages the ref; callers just call `submitTest()`.

### Step 6: Update `TestInterface`

Replace all the extracted state/logic with:
```tsx
const engine = useTestEngine({ sections, onComplete });
```

Component should then destructure what it needs:
```tsx
const {
  testStarted,
  currentSection,
  currentQuestion,
  currentGlobalQuestionIndex,
  timeLeft,
  setTimeLeft,
  currentSectionQuestions,
  currentQuestionData,
  questionStatuses,
  answers,
  selectedAnswer,
  isCurrentMarkedForReview,
  sectionCompleted,
  startTest,
  selectAnswer,
  toggleReview,
  navigateToQuestion,
  nextQuestion,
  previousQuestion,
  requestNextSection,
  confirmNextSection,
  handleTimeUp,
  submitTest,
  isFirstQuestion,
  isLastQuestionInSection,
  isLastSection,
  totalSections,
} = useTestEngine({ sections, onComplete });
```

---

## What Should REMAIN in `TestInterface` After This Task

1. **Proctoring logic** — Tab switch effects, fullscreen effects, clipboard/context-menu effects (these move out in Task 03)
2. **Proctoring state** — `sessionTabSwitchCount`, `warningModalOpen`, `isLastWarning`, `isAutoSubmitted`, `hasAutoSubmittedRef` (move in Task 03)
3. **All JSX rendering**
4. **The `toast` calls** (UI feedback, stays in component)
5. **The section-change dialog trigger** (`document.getElementById("section-warning-dialog")?.click()` — this DOM hack moves to proper controlled state in Task 04)

---

## What NOT To Do

- Do NOT optimize the timer re-render issue yet (Task 04).
- Do NOT move proctoring logic into this hook (Task 03 will create `useProctoring`).
- Do NOT change the component's JSX structure (Task 04).
- Do NOT change the hook's file location (Task 11 will reorganize).
- Do NOT change how `Timer` receives `setTimeLeft` (optimization is Task 04).

---

## Verification

```
[ ] useTestEngine hook created in hooks/use-test-engine.ts
[ ] TestInterface imports and uses the hook
[ ] TestInterface no longer has useState for: currentSection, currentQuestion, answers, visitedQuestions, markedForReview, sectionCompleted, totalTimeSpent, testStarted, timeLeft
[ ] All test-taking behavior is unchanged (manual QA: start test, answer questions, navigate, mark for review, change sections, submit)
[ ] npx next build — must pass cleanly
```
