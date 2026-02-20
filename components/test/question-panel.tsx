"use client";

import { memo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { questionStatusMeta, testUi } from "@/components/test/test-design-system";

interface QuestionPanelProps {
  questionNumber: number;
  questionText: string;
  options: string[];
  onAnswer: (answerId: number) => void;
  selectedAnswer?: number;
  isMarkedForReview: boolean;
  onToggleReview: () => void;
}

export const QuestionPanel = memo(function QuestionPanel({
  questionNumber,
  questionText,
  options,
  onAnswer,
  selectedAnswer,
  isMarkedForReview,
  onToggleReview,
}: QuestionPanelProps) {
  const isImageUrl = (str: string) => {
    return (
      str.match(/\.(jpeg|jpg|gif|png)$/i) !== null ||
      (str.startsWith("http") &&
        (str.includes("/images/") || str.includes("/img/")))
    );
  };

  const renderContent = (content: string) => {
    if (isImageUrl(content)) {
      return (
        <div className="flex justify-center my-2">
          <Image
            src={content}
            alt="Question content"
            width={500}
            height={300}
            className="max-w-full object-contain rounded-md"
            unoptimized
          />
        </div>
      );
    }
    return <span>{content}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[hsl(var(--test-border))] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className={testUi.bodyText}>Question {questionNumber}</h2>
          <div className="text-lg font-medium text-[hsl(var(--test-foreground))]">
            {renderContent(questionText)}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onToggleReview}
          className={cn(
            testUi.secondaryButton,
            "shrink-0",
            isMarkedForReview &&
              "border-[hsl(var(--test-status-review-border))] bg-[hsl(var(--test-status-review-bg))] text-[hsl(var(--test-status-review-text))] hover:bg-[hsl(var(--test-status-review-bg))]"
          )}
        >
          {isMarkedForReview ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isMarkedForReview ? "Marked for Review" : "Mark for Review"}
        </Button>
      </div>

      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value, 10))}
        className="space-y-3"
      >
        {options.map((option, idx) => {
          const optionId = `question-${questionNumber}-option-${idx}`;
          const isSelected = selectedAnswer === idx;

          return (
            <div
              key={idx}
              onClick={() => onAnswer(idx)}
              className={cn(
                "cursor-pointer rounded-xl border p-4",
                isSelected
                  ? questionStatusMeta.answered.buttonClassName
                  : "border-[hsl(var(--test-border))] hover:bg-[hsl(var(--test-surface-muted))]"
              )}
            >
              <RadioGroupItem
                value={idx.toString()}
                id={optionId}
                className="peer sr-only"
              />
              <Label
                htmlFor={optionId}
                className={cn(
                  "flex cursor-pointer items-start gap-3 text-[hsl(var(--test-foreground))]",
                  isSelected &&
                    "text-[hsl(var(--test-status-answered-text))]"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isSelected
                      ? "border-[hsl(var(--test-status-answered-border))] bg-[hsl(var(--test-status-answered-bg))] text-[hsl(var(--test-status-answered-text))]"
                      : "border-[hsl(var(--test-border-strong))] text-[hsl(var(--test-muted-foreground))]"
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <div className="flex-1">{renderContent(option)}</div>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--test-status-answered-border))] bg-[hsl(var(--test-status-answered-bg))] px-2 py-0.5 text-xs font-semibold text-[hsl(var(--test-status-answered-text))]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Selected
                  </span>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className={`flex items-center justify-between ${testUi.bodyText}`}>
        <span>
          {selectedAnswer === undefined
            ? "Select one option to continue."
            : "Answer selected."}
        </span>
        <span>
          {isMarkedForReview ? "This question is flagged for review." : " "}
        </span>
      </div>
    </div>
  );
});
