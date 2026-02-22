# Task 03 — Extract `useProctoring` Hook

## Priority: 🔴 Critical
## Estimated Effort: 2–3 hours
## Dependencies: Task 02 (Extract `useTestEngine`)

---

## Why This Matters

After Task 02, `TestInterface` will still contain ~150 lines of proctoring logic inlined as `useEffect` blocks:
- Tab/window switch detection and counting
- Auto-submission on excessive switches
- Fullscreen management
- Clipboard (copy/paste/cut) blocking
- Context menu blocking

These are a single domain concern: **test security / proctoring**. They should live in one hook so that:
1. Proctoring rules can be tested independently
2. Different test types can have different proctoring rules
3. The component stays a pure renderer

---

## What `useProctoring` Should Own

### State
| State | Current Implementation (in TestInterface) |
|---|---|
| `sessionTabSwitchCount` | `useState(0)` |
| `warningModalOpen` | `useState(false)` |
| `isLastWarning` | `useState(false)` |
| `isAutoSubmitted` | `useState(false)` |
| `hasAutoSubmittedRef` | `useRef(false)` |

### Effects to Move
All of these `useEffect` blocks currently in `TestInterface`:

**1. Fullscreen management (lines 89-116)**
```tsx
useEffect(() => {
  const enterFullscreen = async () => { ... };
  if (testStarted) {
    enterFullscreen();
    document.body.classList.add("test-mode");
  }
  return () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
    document.body.classList.remove("test-mode");
  };
}, [testStarted]);
```

**2. Visibility change listener (lines 130-140)**
```tsx
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden && testStarted && !hasAutoSubmittedRef.current) {
      setSessionTabSwitchCount((previous) => previous + 1);
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
}, [testStarted]);
```

**3. Tab switch escalation (lines 142-168)**
```tsx
useEffect(() => {
  if (!testStarted || sessionTabSwitchCount === 0) return;
  if (sessionTabSwitchCount <= 2) { /* warning */ }
  if (sessionTabSwitchCount === 3) { /* last warning */ }
  if (!hasAutoSubmittedRef.current) { /* auto submit */ }
}, [sessionTabSwitchCount, testStarted]);
```

**4. Copy/paste prevention (lines 170-191)**
```tsx
useEffect(() => {
  const preventCopyPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    toast({ ... });
  };
  if (testStarted) {
    document.addEventListener("copy", preventCopyPaste);
    // ...
  }
  return () => { /* cleanup */ };
}, [testStarted, toast]);
```

**5. Context menu prevention (lines 193-203)**
```tsx
useEffect(() => {
  const preventContextMenu = (event: MouseEvent) => event.preventDefault();
  if (testStarted) {
    document.addEventListener("contextmenu", preventContextMenu);
  }
  return () => document.removeEventListener("contextmenu", preventContextMenu);
}, [testStarted]);
```

---

## Hook Signature

```typescript
// hooks/use-proctoring.ts

interface UseProctoringOptions {
  enabled: boolean;                       // testStarted
  onAutoSubmit: () => void;               // calls engine.submitTest()
  onViolation?: (type: 'clipboard' | 'contextmenu') => void;  // optional toast callback
  maxTabSwitches?: number;                // default: 3 (auto-submit after this + 1)
}

interface UseProctoringReturn {
  // State for the warning modal
  tabSwitchCount: number;
  warningModalOpen: boolean;
  isLastWarning: boolean;
  isAutoSubmitted: boolean;

  // Actions
  dismissWarning: () => void;             // closes the warning modal
  resetProctoring: () => void;            // resets all counts (called on test start)
}
```

---

## File Location

Create: `hooks/use-proctoring.ts`

---

## Implementation Steps

### Step 1: Create the hook

Create `hooks/use-proctoring.ts`. Move all 5 effects listed above into this hook.

**Key design decision:** The hook takes an `onAutoSubmit` callback instead of directly calling the engine's submit function. This keeps the proctoring hook decoupled from the test engine — it doesn't import `useTestEngine` or know about test domain logic.

### Step 2: Handle the toast dependency

Currently, clipboard blocking calls `toast()` inline. The hook should accept an `onViolation` callback for this instead of importing `useToast` directly. This keeps the hook UI-framework-agnostic.

Usage in `TestInterface`:
```tsx
const proctoring = useProctoring({
  enabled: engine.testStarted,
  onAutoSubmit: engine.submitTest,
  onViolation: (type) => {
    if (type === 'clipboard') {
      toast({
        title: "Action not allowed",
        description: "Copy and paste are disabled during the test",
        variant: "destructive",
      });
    }
  },
});
```

### Step 3: Handle the section-change toast

The `confirmNextSection` in `TestInterface` currently shows a toast:
```tsx
toast({
  title: "New Section Started",
  description: `You are now in ${sections[nextSection].name}`,
});
```
This is NOT proctoring — it's test engine feedback. It should stay in the component (called after `engine.confirmNextSection()`). Do not move this toast into the proctoring hook.

### Step 4: Update `TestInterface`

After extracting, `TestInterface` should use both hooks:
```tsx
const engine = useTestEngine({ sections, onComplete });
const proctoring = useProctoring({
  enabled: engine.testStarted,
  onAutoSubmit: engine.submitTest,
  onViolation: (type) => { /* toast */ },
});
```

The `TabSwitchWarningModal` then receives proctoring state:
```tsx
<TabSwitchWarningModal
  open={proctoring.warningModalOpen}
  onClose={proctoring.dismissWarning}
  tabSwitchCount={proctoring.tabSwitchCount}
  isLastWarning={proctoring.isLastWarning}
  isAutoSubmitted={proctoring.isAutoSubmitted}
/>
```

### Step 5: Reset coordination

When the test starts, proctoring must be reset. Two approaches:

**Option A (recommended):** The hook auto-resets when `enabled` transitions from `false` to `true`.
```typescript
const prevEnabled = useRef(enabled);
useEffect(() => {
  if (enabled && !prevEnabled.current) {
    resetProctoring();
  }
  prevEnabled.current = enabled;
}, [enabled]);
```

**Option B:** The component explicitly calls `proctoring.resetProctoring()` in the `startTest` flow. This is more explicit but adds coupling.

Go with Option A.

---

## What Should REMAIN in `TestInterface` After This Task

After Tasks 02 and 03, `TestInterface` should contain:
1. The hook invocations (`useTestEngine`, `useProctoring`)
2. `useToast()` for UI feedback
3. All JSX rendering
4. The section-change toast inside the component
5. The DOM hack for section-warning dialog (`document.getElementById(...)`)

The component should be roughly **250-300 lines** — mostly JSX.

---

## What NOT To Do

- Do NOT add camera/screen recording proctoring yet.
- Do NOT change `TabSwitchWarningModal`'s interface.
- Do NOT change the component's JSX layout (Task 04).
- Do NOT remove the `document.getElementById("section-warning-dialog")` hack yet (Task 04 fixes that).

---

## Verification

```
[ ] useProctoring hook created in hooks/use-proctoring.ts
[ ] TestInterface no longer has useState for: sessionTabSwitchCount, warningModalOpen, isLastWarning, isAutoSubmitted
[ ] TestInterface no longer has useEffect for: fullscreen, visibility change, tab switch escalation, clipboard prevention, context menu prevention
[ ] TestInterface uses both useTestEngine and useProctoring
[ ] Proctoring behavior unchanged (manual QA: switch tabs → warnings appear → auto-submit after 4th switch)
[ ] Fullscreen enters on test start, exits on unmount
[ ] Copy/paste disabled during test
[ ] npx next build — must pass cleanly
```
