import { cn } from "@/lib/utils";

export type QuestionStatus =
    | "notVisited"
    | "visitedUnanswered"
    | "answered"
    | "markedForReview";

export const questionStatusMeta: Record<
    QuestionStatus,
    { label: string; className: string }
> = {
    markedForReview: {
        label: "Marked for review",
        className:
            "border-[hsl(var(--status-review-border))] bg-[hsl(var(--status-review-bg))] text-[hsl(var(--status-review-text))]",
    },
    visitedUnanswered: {
        label: "Visited, not answered",
        className:
            "border-[hsl(var(--status-unanswered-border))] bg-[hsl(var(--status-unanswered-bg))] text-[hsl(var(--status-unanswered-text))]",
    },
    answered: {
        label: "Visited, answered",
        className:
            "border-[hsl(var(--status-answered-border))] bg-[hsl(var(--status-answered-bg))] text-[hsl(var(--status-answered-text))]",
    },
    notVisited: {
        label: "Not visited",
        className:
            "border-border bg-card text-foreground",
    },
};

export const questionStatusLegendOrder: QuestionStatus[] = [
    "markedForReview",
    "visitedUnanswered",
    "answered",
    "notVisited",
];

const questionButtonBase =
    "h-10 cursor-pointer rounded-xl border text-sm font-semibold !transition-none";

export function getQuestionButtonClassName({
    status,
    isCurrent,
}: {
    status: QuestionStatus;
    isCurrent: boolean;
}) {
    return cn(
        questionButtonBase,
        questionStatusMeta[status].className,
        isCurrent && "ring-2 ring-ring ring-offset-2 ring-offset-background"
    );
}
