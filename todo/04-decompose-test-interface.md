# Task 04 — Decompose `TestInterface` Component Shell

## Priority: 🟠 High
## Estimated Effort: 2–3 hours
## Dependencies: Task 02, Task 03

---

## Why This Matters

After Tasks 02 and 03, `TestInterface` has delegated all logic to hooks but still renders a single massive JSX tree (~250-300 lines). The JSX includes inline AlertDialogs, conditional rendering chains, and a DOM hack (`document.getElementById`). This task decomposes the JSX into focused, composable sub-components and eliminates imperative patterns.

The second goal is **fixing the timer re-render cascade**: the `setTimeLeft` call every second currently re-renders the entire component tree.

---

## Current Component Structure (After Tasks 02+03)

```
TestInterface
├── WarningModal (pre-test)
├── TestHeader
├── Surface (section info + timer + section tabs)
│   ├── Typography (section name)
│   ├── Timer (inline variant)
│   ├── Button (next section)
│   └── Section tab badges (map)
├── Grid
│   ├── QuestionPanel (with key={currentGlobalQuestionIndex})
│   └── QuestionNavigation
├── StickyBar (bottom navigation)
│   ├── Button Previous
│   ├── Question counter text
│   ├── Button Next / Button Next Section / AlertDialog Submit
├── AlertDialog (section change warning — triggered via DOM hack)
└── TabSwitchWarningModal
```

---

## Target Component Structure

```
TestInterface (~80-100 lines)
├── WarningModal (pre-test)        ← keep as-is
├── TestHeader                      ← keep as-is
├── SectionInfoBar (NEW)            ← extract
│   ├── Section name + description
│   ├── Timer
│   ├── Next Section button
│   └── Section tab badges
├── Grid
│   ├── QuestionPanel               ← keep as-is (already memoized)
│   └── QuestionNavigation          ← keep as-is (already memoized)
├── TestFooter (NEW)                ← extract
│   ├── Previous / Next / Submit / Next Section buttons
│   └── Question counter text
├── SectionChangeDialog (NEW)       ← extract, use controlled state
├── SubmitConfirmDialog (NEW)       ← extract from inline AlertDialog
└── TabSwitchWarningModal            ← keep as-is
```

---

## Sub-Components to Create

### 1. `SectionInfoBar`

**File:** `components/test/section-info-bar.tsx`

**Receives:**
```typescript
interface SectionInfoBarProps {
  sectionName: string;
  sections: { name: string }[];
  currentSectionIndex: number;
  sectionCompleted: boolean[];
  timeLeft: number;
  totalTime: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
  showNextSection: boolean;
  onNextSection: () => void;
}
```

**Contains:** The `Surface` block currently at lines 330-376 of `TestInterface`.

**Memoization:** Wrap with `memo`. This is important because `timeLeft` changes every second — but `SectionInfoBar` needs `timeLeft` for the `Timer`, so it WILL re-render every second. The benefit is isolating the re-render scope: components OUTSIDE `SectionInfoBar` won't re-render due to timer ticks.

**TIMER RE-RENDER FIX:** The architectural solution is to make `timeLeft` state live INSIDE the `Timer` component (or inside `SectionInfoBar`), not in `useTestEngine`. The engine should only receive the time when it needs it (on section change or submit). This requires:
- Remove `timeLeft` and `setTimeLeft` from `useTestEngine`'s return value
- Timer manages its own countdown internally
- Timer exposes time through a ref (`timerRef.current.getTimeLeft()`) or callback
- Engine calls into timer only on section change and submit

**Simplified approach for this task:** Keep `timeLeft` in the engine but stop it from re-rendering the main component. Technique: use a context boundary.

```tsx
// SectionInfoBar manages its own timer subscription
// The parent TestInterface doesn't receive timeLeft updates
```

Actually, the cleanest approach:

1. `useTestEngine` returns `timeLeft` and `setTimeLeft` as before
2. `TestInterface` passes them to `SectionInfoBar`
3. `SectionInfoBar` is **NOT memoized** (it re-renders every second — that's fine, it's small)
4. `QuestionPanel` and `QuestionNavigation` are already `memo`-wrapped and their props don't include `timeLeft`, so they DON'T re-render

The real question is: does `TestInterface` itself re-render every second? Yes, because `timeLeft` is in its state. The fix:

**Move `timeLeft` state into `SectionInfoBar` directly.** The engine hook takes a `timerRef` instead:

```typescript
// In useTestEngine:
const timerRef = useRef({ getTimeLeft: () => 0 });

// In SectionInfoBar:
const [timeLeft, setTimeLeft] = useState(totalTime);
useImperativeHandle(timerRef, () => ({ getTimeLeft: () => timeLeft }));
```

**Simplest correct approach:** Actually, the simplest fix is to not return `timeLeft` from `useTestEngine` at all. Instead:
1. `useTestEngine` stores `timeLeft` in a `useRef` (not state) — no re-renders
2. Timer component calls `engine.updateTimeLeft(value)` which updates the ref
3. Timer component manages its own `useState` for visual display
4. When engine needs the time (submit, section change), it reads from the ref

**For this task, use this approach ↑**

---

### 2. `TestFooter`

**File:** `components/test/test-footer.tsx`

**Receives:**
```typescript
interface TestFooterProps {
  currentQuestion: number;         // 0-indexed
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onNextSection: () => void;
  onSubmit: () => void;
}
```

**Contains:** The `StickyBar` block currently at lines 408-469.

**Important:** The submit button currently has an inline `AlertDialog`. Extract that into `SubmitConfirmDialog` (see below).

---

### 3. `SectionChangeDialog`

**File:** `components/test/section-change-dialog.tsx`

**This eliminates the DOM hack.** Currently, `TestInterface` opens the section-change dialog by:
```tsx
const sectionDialogTrigger = document.getElementById("section-warning-dialog");
sectionDialogTrigger?.click();
```

This is fragile and untestable. Replace with controlled state:

```typescript
interface SectionChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
```

In the engine hook, `requestNextSection()` should set a state flag. The component passes it:
```tsx
<SectionChangeDialog
  open={engine.sectionChangeRequested}    // new boolean from engine
  onOpenChange={(open) => !open && engine.cancelSectionChange()}
  onConfirm={engine.confirmNextSection}
/>
```

**Update `useTestEngine`:**
- Add `sectionChangeRequested: boolean` state
- `requestNextSection()` sets it to `true`
- `confirmNextSection()` sets it to `false` + does the transition
- Add `cancelSectionChange()` that sets it to `false`

---

### 4. `SubmitConfirmDialog`

**File:** `components/test/submit-confirm-dialog.tsx`

Extract the inline submit AlertDialog (lines 427-450) into a controlled component:

```typescript
interface SubmitConfirmDialogProps {
  onSubmit: () => void;
  trigger: React.ReactNode;     // the Submit Test button
}
```

Or use uncontrolled approach (keep AlertDialog's own open state) — this is simpler and fine for a confirmation dialog.

---

## Final `TestInterface` After This Task

```tsx
export function TestInterface({ testId, testName, sections, onComplete }: TestInterfaceProps) {
  const engine = useTestEngine({ sections, onComplete });
  const proctoring = useProctoring({
    enabled: engine.testStarted,
    onAutoSubmit: engine.submitTest,
    onViolation: (type) => { /* toast */ },
  });
  const { toast } = useToast();

  if (!engine.testStarted) {
    return <WarningModal onStart={engine.startTest} />;
  }

  return (
    <div className="min-h-screen bg-background py-2 lg:py-8">
      <TestHeader testName={`${testName} - ${sections[engine.currentSection].name}`} />

      <PageWrapper>
        <SectionInfoBar
          sectionName={sections[engine.currentSection].name}
          sections={sections}
          currentSectionIndex={engine.currentSection}
          sectionCompleted={engine.sectionCompleted}
          totalTime={sections[engine.currentSection].duration * 60}
          onTimeUp={engine.handleTimeUp}
          showNextSection={!engine.isLastSection}
          onNextSection={engine.requestNextSection}
          timerRef={engine.timerRef}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <div key={engine.currentGlobalQuestionIndex}>
              <Surface className="p-5 lg:p-6">
                <QuestionPanel
                  questionNumber={engine.currentQuestion + 1}
                  questionText={engine.currentQuestionData.question}
                  options={engine.currentQuestionData.options}
                  onAnswer={engine.selectAnswer}
                  selectedAnswer={engine.selectedAnswer}
                  isMarkedForReview={engine.isCurrentMarkedForReview}
                  onToggleReview={engine.toggleReview}
                />
              </Surface>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <Surface className="p-4">
              <QuestionNavigation
                questionStatuses={engine.questionStatuses}
                currentQuestion={engine.currentQuestion + 1}
                onQuestionSelect={engine.navigateToQuestion}
              />
            </Surface>
          </div>
        </div>

        <TestFooter
          currentQuestion={engine.currentQuestion}
          totalQuestions={engine.currentSectionQuestions.length}
          isFirstQuestion={engine.isFirstQuestion}
          isLastQuestionInSection={engine.isLastQuestionInSection}
          isLastSection={engine.isLastSection}
          onPrevious={engine.previousQuestion}
          onNext={engine.nextQuestion}
          onNextSection={engine.requestNextSection}
          onSubmit={engine.submitTest}
        />
      </PageWrapper>

      <SectionChangeDialog
        open={engine.sectionChangeRequested}
        onOpenChange={(open) => !open && engine.cancelSectionChange()}
        onConfirm={() => {
          engine.confirmNextSection();
          toast({
            title: "New Section Started",
            description: `You are now in ${sections[engine.currentSection + 1]?.name}`,
          });
        }}
      />

      <TabSwitchWarningModal
        open={proctoring.warningModalOpen}
        onClose={proctoring.dismissWarning}
        tabSwitchCount={proctoring.tabSwitchCount}
        isLastWarning={proctoring.isLastWarning}
        isAutoSubmitted={proctoring.isAutoSubmitted}
      />
    </div>
  );
}
```

**~80 lines of pure composition.** Down from 513.

---

## Verification

```
[ ] SectionInfoBar created and renders correctly
[ ] TestFooter created and renders correctly
[ ] SectionChangeDialog uses controlled open state (no DOM hack)
[ ] SubmitConfirmDialog extracted
[ ] TestInterface is ~80-100 lines of composition
[ ] Timer no longer causes full TestInterface re-render
[ ] All test-taking behavior unchanged (manual QA)
[ ] npx next build — must pass cleanly
```
