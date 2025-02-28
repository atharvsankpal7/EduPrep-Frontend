"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface QuestionPanelProps {
  questionNumber: number;
  questionText: string;
  options: string[];
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
  // Function to check if a string is a valid image URL
  const isImageUrl = (str: string) => {
    return str.match(/\.(jpeg|jpg|gif|png)$/) !== null || str.startsWith('http') && (str.includes('/images/') || str.includes('/img/'));
  };

  // Function to render text or image based on content
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
            unoptimized // For external images
          />
        </div>
      );
    }
    return <span>{content}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Question {questionNumber}
        </h2>
        <div className="text-lg font-medium">
          {renderContent(questionText)}
        </div>
      </div>

      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value))}
        className="space-y-3"
      >
        {options.map((option, idx) => (
          <Card
            key={idx}
            className={`p-4 cursor-pointer transition-transform duration-200 ${
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
                {String.fromCharCode(65 + idx)} {/* A, B, C, etc. */}
              </span>
              <div className="flex-1">
                {renderContent(option)}
              </div>
            </Label>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}