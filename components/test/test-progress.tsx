"use client";

import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface TestProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export function TestProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: TestProgressProps) {
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Progress</h3>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{Math.round(progress)}% Complete</span>
          <span>{answeredQuestions}/{totalQuestions}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Answered</span>
        </div>
        <span>{answeredQuestions}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Circle className="w-4 h-4 text-muted-foreground" />
          <span>Unanswered</span>
        </div>
        <span>{totalQuestions - answeredQuestions}</span>
      </div>

      {answeredQuestions < currentQuestion && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Current question not answered</span>
        </div>
      )}
    </div>
  );
}