"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { RenderableContent } from "@/components/test-engine/renderable-content";
import { getRenderableContent } from "@/lib/test-engine/content";
import type { EngineQuestion } from "@/types/global/interface/test.apiInterface";

interface QuestionPanelProps {
  question: EngineQuestion;
  questionNumber: number;
  selectedOption: number | undefined;
  isMarkedForReview: boolean;
  disabled?: boolean;
  onSelectOption: (optionIndex: number) => void;
}

function QuestionPanelComponent({
  question,
  questionNumber,
  selectedOption,
  isMarkedForReview,
  disabled = false,
  onSelectOption,
}: QuestionPanelProps) {
  const questionTextMode = getRenderableContent(question.questionText).kind;
  const selectedValue =
    selectedOption === undefined ? "" : selectedOption.toString();

  return (
    <Card className="border-border">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="tabular-nums">
            Question {questionNumber}
          </Badge>
          {isMarkedForReview ? (
            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-200">
              Marked for review
            </Badge>
          ) : null}
        </div>
        <CardTitle className="text-xl leading-relaxed text-balance">
          <RenderableContent
            value={question.questionText}
            altText={`Question ${questionNumber}`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {question.imageUrl && questionTextMode === "text" ? (
          <RenderableContent
            value={question.imageUrl}
            altText={`Question ${questionNumber} visual`}
          />
        ) : null}

        <RadioGroup
          key={question.id}
          value={selectedValue}
          onValueChange={(value) => onSelectOption(Number(value))}
          className="space-y-3"
        >
          {question.options.map((option, optionIndex) => {
            const optionId = `${question.id}-option-${optionIndex}`;
            return (
              <div
                key={optionId}
                className="flex items-start gap-3 rounded-md border border-border p-3"
              >
                <RadioGroupItem
                  id={optionId}
                  value={optionIndex.toString()}
                  disabled={disabled}
                  className="mt-1"
                />
                <Label htmlFor={optionId} className="w-full cursor-pointer text-sm">
                  <RenderableContent
                    value={option}
                    altText={`Option ${optionIndex + 1} for question ${questionNumber}`}
                    className="text-pretty"
                    imageClassName="max-h-48"
                  />
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export const QuestionPanel = memo(QuestionPanelComponent);
