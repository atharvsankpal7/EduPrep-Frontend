"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Record<number, number>;
  onQuestionSelect: (questionNumber: number) => void;
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onQuestionSelect,
}: QuestionNavigationProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Question Navigation</h3>
      
      <div className="grid grid-cols-5 gap-2" role="navigation" aria-label="Questions list">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const isAnswered = !!answeredQuestions[num];
          const isCurrent = currentQuestion === num;
          const statusText = isCurrent
            ? "Current Question"
            : isAnswered
            ? "Answered"
            : "Not Answered";

          return (
            <Button
              key={num}
              variant="outline"
              size="sm"
              className={cn(
                "w-full h-8",
                isCurrent && "ring-2 ring-primary",
                isAnswered && "bg-primary/10 hover:bg-primary/20"
              )}
              onClick={() => onQuestionSelect(num)}
              aria-label={`Question ${num}, ${statusText}`}
              aria-current={isCurrent ? "true" : undefined}
              title={`Question ${num}: ${statusText}`}
            >
              {num}
            </Button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary/10 rounded" />
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-background border rounded" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}