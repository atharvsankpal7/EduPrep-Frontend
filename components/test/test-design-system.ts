import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type QuestionStatus =
  | "notVisited"
  | "visitedUnanswered"
  | "answered"
  | "markedForReview";

const appPrimaryButtonClassName = buttonVariants({ variant: "default" });
const appSecondaryButtonClassName = buttonVariants({ variant: "outline" });
const appGhostButtonClassName = buttonVariants({ variant: "ghost" });

export const testUi = {
  page: "min-h-screen bg-[hsl(var(--test-bg))] text-[hsl(var(--test-foreground))]",
  container: "mx-auto w-full max-w-[1380px] px-4 pb-28 pt-6 lg:px-8",
  surface:
    "rounded-2xl border border-[hsl(var(--test-border))] bg-[hsl(var(--test-surface))] shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
  surfaceMuted:
    "rounded-2xl border border-[hsl(var(--test-border))] bg-[hsl(var(--test-surface-muted))] shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
  pageTitle: "text-base font-semibold tracking-tight text-[hsl(var(--test-foreground))]",
  sectionTitle:
    "text-xl font-semibold tracking-tight text-[hsl(var(--test-foreground))] lg:text-2xl",
  bodyText: "text-sm text-[hsl(var(--test-muted-foreground))]",
  header:
    "sticky top-0 z-50 w-full border-b border-[hsl(var(--test-border))] bg-[hsl(var(--test-surface))] backdrop-blur",
  primaryButton: appPrimaryButtonClassName,
  secondaryButton: appSecondaryButtonClassName,
  ghostButton: appGhostButtonClassName,
  warningButton: cn(
    appSecondaryButtonClassName,
    "border-[hsl(var(--test-status-warning-border))] bg-[hsl(var(--test-status-warning-bg))] text-[hsl(var(--test-status-warning-text))] hover:bg-[hsl(var(--test-status-warning-bg))]"
  ),
  dangerButton: cn(
    appSecondaryButtonClassName,
    "border-[hsl(var(--test-status-danger-border))] bg-[hsl(var(--test-status-danger-bg))] text-[hsl(var(--test-status-danger-text))] hover:bg-[hsl(var(--test-status-danger-bg))]"
  ),
  fixedBar:
    "fixed bottom-0 left-0 right-0 z-40 border-t border-[hsl(var(--test-border))] bg-[hsl(var(--test-surface))] px-3 py-4 backdrop-blur",
};

export const questionStatusMeta: Record<
  QuestionStatus,
  { label: string; buttonClassName: string; legendCardClassName: string }
> = {
  markedForReview: {
    label: "Marked for review",
    buttonClassName:
      "border-[hsl(var(--test-status-review-border))] bg-[hsl(var(--test-status-review-bg))] text-[hsl(var(--test-status-review-text))] hover:bg-[hsl(var(--test-status-review-bg))]",
    legendCardClassName:
      "border-[hsl(var(--test-status-review-border))] bg-[hsl(var(--test-status-review-bg))] text-[hsl(var(--test-status-review-text))]",
  },
  visitedUnanswered: {
    label: "Visited, not answered",
    buttonClassName:
      "border-[hsl(var(--test-status-unanswered-border))] bg-[hsl(var(--test-status-unanswered-bg))] text-[hsl(var(--test-status-unanswered-text))] hover:bg-[hsl(var(--test-status-unanswered-bg))]",
    legendCardClassName:
      "border-[hsl(var(--test-status-unanswered-border))] bg-[hsl(var(--test-status-unanswered-bg))] text-[hsl(var(--test-status-unanswered-text))]",
  },
  answered: {
    label: "Visited, answered",
    buttonClassName:
      "border-[hsl(var(--test-status-answered-border))] bg-[hsl(var(--test-status-answered-bg))] text-[hsl(var(--test-status-answered-text))] hover:bg-[hsl(var(--test-status-answered-bg))]",
    legendCardClassName:
      "border-[hsl(var(--test-status-answered-border))] bg-[hsl(var(--test-status-answered-bg))] text-[hsl(var(--test-status-answered-text))]",
  },
  notVisited: {
    label: "Not visited",
    buttonClassName:
      "border-[hsl(var(--test-border-strong))] bg-[hsl(var(--test-surface))] text-[hsl(var(--test-foreground))] hover:bg-[hsl(var(--test-surface))]",
    legendCardClassName:
      "border-[hsl(var(--test-border-strong))] bg-[hsl(var(--test-surface))] text-[hsl(var(--test-foreground))]",
  },
};

export const questionStatusLegendOrder: QuestionStatus[] = [
  "markedForReview",
  "visitedUnanswered",
  "answered",
  "notVisited",
];

const questionButtonBaseClassName =
  "h-10 cursor-pointer rounded-xl border text-sm font-semibold !transition-none";

export function getQuestionButtonClassName({
  status,
  isCurrent,
}: {
  status: QuestionStatus;
  isCurrent: boolean;
}) {
  return cn(
    questionButtonBaseClassName,
    questionStatusMeta[status].buttonClassName,
    isCurrent &&
      "ring-2 ring-[hsl(var(--test-focus))] ring-offset-2 ring-offset-[hsl(var(--test-surface))]"
  );
}
