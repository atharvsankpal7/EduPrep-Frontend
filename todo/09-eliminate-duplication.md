# Task 09 — Eliminate Duplicated Logic

## Priority: 🟡 Medium
## Estimated Effort: 1–2 hours
## Dependencies: Task 04 (Decompose TestInterface)

---

## Why This Matters

Duplicated logic means:
- Bug fixes must be applied in multiple places
- Behavior drifts between copies over time
- Code review becomes harder ("is this the same as the other one?")

---

## Duplication Inventory

### 1. `isImageUrl` + `renderContent` — Duplicated in 2 files

**Location A:** `components/test/question-panel.tsx` (lines 31-55)
```tsx
const isImageUrl = (str: string) => {
  return (
    str.match(/\.(jpeg|jpg|gif|png)$/i) !== null ||
    (str.startsWith("http") && (str.includes("/images/") || str.includes("/img/")))
  );
};

const renderContent = (content: string) => {
  if (isImageUrl(content)) {
    return (
      <div className="flex justify-center my-2">
        <Image src={content} alt="Question content" width={500} height={300} ... />
      </div>
    );
  }
  return <span>{content}</span>;
};
```

**Location B:** `components/test/test-result-details.tsx` (lines 35-56) — near-identical copy.

**Fix:** Extract into a shared component.

**Create:** `components/common/rich-content.tsx`

```tsx
import Image from "next/image";

function isImageUrl(str: string): boolean {
  return (
    /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(str) ||
    (str.startsWith("http") && (str.includes("/images/") || str.includes("/img/")))
  );
}

interface RichContentProps {
  content: string;
  imageWidth?: number;
  imageHeight?: number;
}

export function RichContent({ content, imageWidth = 500, imageHeight = 300 }: RichContentProps) {
  if (isImageUrl(content)) {
    return (
      <div className="flex justify-center my-2">
        <Image
          src={content}
          alt="Question content"
          width={imageWidth}
          height={imageHeight}
          className="max-w-full object-contain rounded-md"
          unoptimized
        />
      </div>
    );
  }
  return <span>{content}</span>;
}
```

**Update `question-panel.tsx`:**
```tsx
// REMOVE: isImageUrl function
// REMOVE: renderContent function
import { RichContent } from "@/components/common/rich-content";

// Replace: {renderContent(questionText)} → <RichContent content={questionText} />
// Replace: {renderContent(option)} → <RichContent content={option} />
```

**Update `test-result-details.tsx`:**
```tsx
// Same — remove local functions, import RichContent
```

---

### 2. Score Computation — Duplicated formula

**Location A:** `app/result/[...id]/page.tsx` (line 30)
```tsx
score: (section.correctAnswers / section.totalQuestions) * 100,
```

**Location B:** `components/test/test-result.tsx` (line 74 — indirectly, score is passed as a prop but computed by caller)
```tsx
score={(result.correctAnswers / result.totalQuestions) * 100}
```

**Location C:** `components/test/test-result-details.tsx` (line 32)
```tsx
const score = (correctAnswers / totalQuestions) * 100;
```

**Already fixed in Task 07** — `computeScore()` in `result.transformer.ts`. Just verify all three locations now use the transformer or receive the pre-computed value.

---

### 3. Animation Variants — Duplicated in multiple pages

**Location A:** `app/test/page.tsx` (lines 25-38)
```tsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

**Location B:** `app/test/undergraduate/page.tsx` (lines 33-46) — identical copy.

**Already fixed in Task 08** — these pages are converted to server components with CSS animations. Verify framer-motion variants are removed.

---

### 4. Inline Error Display Pattern — Repeated across pages

**Pattern:** Multiple pages have this same error rendering pattern:
```tsx
if (error) {
  return (
    <div className="container py-8 text-center text-destructive">
      {error instanceof Error ? error.message : "Failed to load..."}
    </div>
  );
}
```

Seen in: `app/test/[...id]/page.tsx`, `app/result/[...id]/page.tsx`

**Fix:** Create a shared `QueryErrorDisplay` component.

**Create:** `components/common/query-error.tsx`

```tsx
interface QueryErrorProps {
  error: Error | unknown;
  fallbackMessage?: string;
}

export function QueryError({
  error,
  fallbackMessage = "Something went wrong. Please try again later.",
}: QueryErrorProps) {
  const message = error instanceof Error ? error.message : fallbackMessage;

  return (
    <div className="container py-8 text-center text-destructive">
      {message}
    </div>
  );
}
```

---

### 5. Empty State Pattern — Repeated across pages

**Pattern:**
```tsx
if (!data) {
  return <div className="container py-8 text-center">No data available</div>;
}
```

**Fix:** Create a shared `EmptyState` component.

**Create:** `components/common/empty-state.tsx`

```tsx
interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No data available" }: EmptyStateProps) {
  return (
    <div className="container py-8 text-center text-muted-foreground">
      {message}
    </div>
  );
}
```

---

## Files to Create/Modify

| File | Action |
|---|---|
| `components/common/rich-content.tsx` | **CREATE** |
| `components/common/query-error.tsx` | **CREATE** |
| `components/common/empty-state.tsx` | **CREATE** |
| `components/test/question-panel.tsx` | **MODIFY** — use `RichContent` |
| `components/test/test-result-details.tsx` | **MODIFY** — use `RichContent` |
| `app/test/[...id]/page.tsx` | **MODIFY** — use `QueryError`, `EmptyState` |
| `app/result/[...id]/page.tsx` | **MODIFY** — use `QueryError`, `EmptyState` |

---

## Verification

```
[ ] RichContent component created, used in question-panel and test-result-details
[ ] No isImageUrl / renderContent functions remain in component files
[ ] QueryError component created, used in test and result pages
[ ] EmptyState component created
[ ] Score computation only exists in result.transformer.ts (from Task 07)
[ ] npx next build — must pass cleanly
```
