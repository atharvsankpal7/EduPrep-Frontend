"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface QuestionPanelProps {
  questionNumber: number;
  questionText: string; // Add this property
  options: string[]; // Add this property
  onAnswer: (answerId: number) => void;
  selectedAnswer?: number;
}

export function QuestionPanel({
  questionNumber,
  questionText,
  options,
  onAnswer,
  selectedAnswer,
}: QuestionPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Question {questionNumber}
        </h2>
        <p className="text-lg font-medium">{questionText}</p>
      </div>

      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value))}
        className="space-y-3"
      >
        {options.map((option, idx) => (
          <Card
            key={idx}
            className={`p-4 cursor-pointer transition-transform transform  duration-200 ${
              selectedAnswer === idx
                ? "ring-2 ring-primary bg-primary/10"
                : "hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem
              value={idx.toString()}
              id={`option-${idx}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`option-${idx}`}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full border border-primary/20 text-sm">
                {String.fromCharCode(65 + idx)} {/* Changed to A, B, C, etc. */}
              </span>
              <span>{option}</span>
            </Label>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}
