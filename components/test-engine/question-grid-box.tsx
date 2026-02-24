"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuestionVisualState } from "@/hooks/use-test-engine";

interface QuestionGridBoxProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  questionStatuses: QuestionVisualState[];
  disabled?: boolean;
  onSelectQuestion: (questionIndex: number) => void;
}

const statusClassMap: Record<QuestionVisualState, string> = {
  "not-visited": "bg-muted text-muted-foreground border-border",
  "visited-unanswered":
    "bg-orange-500/15 text-orange-700 border-orange-300 dark:text-orange-200 dark:border-orange-700",
  answered:
    "bg-green-500/15 text-green-700 border-green-300 dark:text-green-200 dark:border-green-700",
  "marked-for-review":
    "bg-blue-500/15 text-blue-700 border-blue-300 dark:text-blue-200 dark:border-blue-700",
};

function QuestionGridBoxComponent({
  totalQuestions,
  currentQuestionIndex,
  questionStatuses,
  disabled = false,
  onSelectQuestion,
}: QuestionGridBoxProps) {
  return (
    <aside className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <h3 className="text-sm font-semibold text-balance">Section Question Map</h3>
        <p className="text-xs text-muted-foreground">
          Jump to any question in this section.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const status = questionStatuses[index] ?? "not-visited";
          const isCurrent = index === currentQuestionIndex;

          return (
            <Button
              key={`question-grid-${index + 1}`}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onSelectQuestion(index)}
              className={cn(
                "h-9 w-9 p-0 text-xs tabular-nums",
                statusClassMap[status],
                isCurrent && "ring-2 ring-ring ring-offset-2 ring-offset-background"
              )}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <p className="flex items-center gap-2">
          <span className="size-3 rounded border border-border bg-muted" />
          Not visited
        </p>
        <p className="flex items-center gap-2">
          <span className="size-3 rounded border border-orange-300 bg-orange-500/15" />
          Visited
        </p>
        <p className="flex items-center gap-2">
          <span className="size-3 rounded border border-green-300 bg-green-500/15" />
          Answered
        </p>
        <p className="flex items-center gap-2">
          <span className="size-3 rounded border border-blue-300 bg-blue-500/15" />
          Review
        </p>
      </div>
    </aside>
  );
}

export const QuestionGridBox = memo(QuestionGridBoxComponent);
