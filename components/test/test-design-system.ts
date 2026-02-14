import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type QuestionStatus =
  | "notVisited"
  | "visitedUnanswered"
  | "answered"
  | "markedForReview";

export const testInterfaceTheme: CSSProperties = {
  ["--test-bg" as string]: "204 33% 95%",
  ["--test-surface" as string]: "0 0% 100%",
  ["--test-surface-muted" as string]: "204 36% 98%",
  ["--test-foreground" as string]: "210 32% 14%",
  ["--test-muted-foreground" as string]: "214 17% 38%",
  ["--test-border" as string]: "212 24% 86%",
  ["--test-border-strong" as string]: "212 20% 78%",
  ["--test-primary" as string]: "180 56% 31%",
  ["--test-primary-foreground" as string]: "0 0% 100%",
  ["--test-focus" as string]: "180 60% 37%",
};

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
    "border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
  ),
  dangerButton: cn(
    appSecondaryButtonClassName,
    "border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200"
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
      "border-violet-300 bg-violet-200 text-violet-900 hover:bg-violet-200",
    legendCardClassName: "border-violet-300 bg-violet-100 text-violet-900",
  },
  visitedUnanswered: {
    label: "Visited, not answered",
    buttonClassName: "border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-100",
    legendCardClassName: "border-rose-200 bg-rose-100 text-rose-800",
  },
  answered: {
    label: "Visited, answered",
    buttonClassName:
      "border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    legendCardClassName: "border-emerald-200 bg-emerald-100 text-emerald-800",
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
