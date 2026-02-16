"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Timer } from "@/components/mock-test/timer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
];

interface TestInterfaceProps {
  testId: string;
  onTestEnd: () => void;
}

export function TestInterface({ testId, onTestEnd }: TestInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const progress = (currentQuestion / mockQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: parseInt(value),
    });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = Object.entries(answers).reduce((acc, [questionIndex, answer]) => {
      return acc + (mockQuestions[parseInt(questionIndex)].correctAnswer === answer ? 1 : 0);
    }, 0);

    toast({
      title: "Test Completed!",
      description: `You scored ${score} out of ${mockQuestions.length} questions.`,
    });
    onTestEnd();
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Mock Test</h2>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </p>
          </div>
          <Timer initialTime={3600} onTimeUp={handleSubmit} />
        </div>

        <Progress value={progress} className="mb-6" />

        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-lg mb-4">{mockQuestions[currentQuestion].text}</p>
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {mockQuestions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion === mockQuestions.length - 1 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Submit Test</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Once submitted, you won&apos;t be able to modify your answers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}