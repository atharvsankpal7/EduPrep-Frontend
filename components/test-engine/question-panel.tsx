"use client";

import { memo, useCallback } from "react";
import { Bookmark, BookmarkCheck, Eraser } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RenderableContent } from "@/components/test-engine/renderable-content";
import { TEOptionCard, TEKbd, TESeparator } from "@/components/test-engine/te-primitives";
import { getRenderableContent } from "@/lib/test-engine/content";
import type { EngineQuestion } from "@/types/global/interface/test.apiInterface";

interface QuestionPanelProps {
  question: EngineQuestion;
  questionNumber: number;
  selectedOption: number | undefined;
  isMarkedForReview: boolean;
  disabled?: boolean;
  onSelectOption: (optionIndex: number) => void;
  onToggleReview: () => void;
  onClearResponse: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

function QuestionPanelComponent({
  question,
  questionNumber,
  selectedOption,
  isMarkedForReview,
  disabled = false,
  onSelectOption,
  onToggleReview,
  onClearResponse,
}: QuestionPanelProps) {
  const questionTextMode = getRenderableContent(question.questionText).kind;
  const selectedValue =
    selectedOption === undefined ? "" : selectedOption.toString();

  const handleCardClick = useCallback(
    (optionIndex: number) => {
      if (disabled) return;
      onSelectOption(optionIndex);
    },
    [disabled, onSelectOption]
  );

  return (
    <div className="min-w-0 flex-1">
      <div className="rounded-xl border border-border bg-card p-5 md:p-7">
        {/* Header row: question number + actions */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="tabular-nums text-xs font-semibold"
            >
              Question {questionNumber}
            </Badge>
            {isMarkedForReview && (
              <Badge className="gap-1 bg-[hsl(var(--status-review-bg))] text-[hsl(var(--status-review-text))] border border-[hsl(var(--status-review-border))] hover:bg-[hsl(var(--status-review-bg))]">
                <Bookmark className="size-3" />
                Review
              </Badge>
            )}
          </div>

          {/* Actions row: Clear + Mark for Review */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || selectedOption === undefined}
              onClick={onClearResponse}
              className="h-8 gap-1.5 px-3 text-xs text-muted-foreground border-dashed"
              aria-label="Clear response"
            >
              <Eraser className="size-3.5" />
              Clear
            </Button>
            <TESeparator />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={onToggleReview}
              className="h-8 gap-1.5 px-3 text-xs"
              aria-label={
                isMarkedForReview
                  ? "Remove review mark"
                  : "Mark for review"
              }
            >
              {isMarkedForReview ? (
                <BookmarkCheck className="size-3.5" />
              ) : (
                <Bookmark className="size-3.5" />
              )}
              {isMarkedForReview ? "Unmark" : "Mark Review"}
            </Button>
          </div>
        </div>

        {/* Question text */}
        <div className="mb-6 max-w-[72ch] text-base leading-[1.6] text-foreground md:text-lg">
          <RenderableContent
            value={question.questionText}
            altText={`Question ${questionNumber}`}
          />
        </div>

        {/* Optional image */}
        {question.imageUrl && questionTextMode === "text" && (
          <div className="mb-6">
            <RenderableContent
              value={question.imageUrl}
              altText={`Question ${questionNumber} visual`}
            />
          </div>
        )}

        {/* Options */}
        <RadioGroup
          key={question.id}
          value={selectedValue}
          onValueChange={(value) => onSelectOption(Number(value))}
          className="space-y-4"
          aria-label={`Options for question ${questionNumber}`}
        >
          {question.options.map((option, optionIndex) => {
            const optionId = `${question.id}-option-${optionIndex}`;
            const isSelected = selectedOption === optionIndex;
            const label = OPTION_LABELS[optionIndex] ?? `${optionIndex + 1}`;

            return (
              <TEOptionCard
                key={optionId}
                selected={isSelected}
                disabled={disabled}
                onClick={() => handleCardClick(optionIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(optionIndex);
                  }
                }}
                aria-label={`Option ${label}`}
              >
                {/* Keyboard indicator */}
                <TEKbd>{label}</TEKbd>


                {/* Hidden radio for a11y */}
                <RadioGroupItem
                  id={optionId}
                  value={optionIndex.toString()}
                  disabled={disabled}
                  className="sr-only"
                />

                {/* Option content */}
                <Label
                  htmlFor={optionId}
                  className="flex-1 cursor-pointer text-sm leading-relaxed text-foreground"
                >
                  <RenderableContent
                    value={option}
                    altText={`Option ${label} for question ${questionNumber}`}
                    className="text-pretty"
                    imageClassName="max-h-48"
                  />
                </Label>

                {/* Selected check indicator */}
                {isSelected && (
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--blue-primary))]">
                    <svg
                      className="size-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                )}
              </TEOptionCard>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}

export const QuestionPanel = memo(QuestionPanelComponent);
