"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Timer } from "@/components/test/timer";
import { QuestionPanel } from "@/components/test/question-panel";
import { TestHeader } from "@/components/test/test-header";
import { ProctorControls } from "@/components/test/proctor-controls";
import { TestProgress } from "@/components/test/test-progress";
import { QuestionNavigation } from "@/components/test/question-navigation";
import { TestWarning } from "@/components/test/student/test-warning";
import { FullscreenRequest } from "@/components/test/fullscreen-request";
import { useFullscreen } from "@/components/test/hooks/use-fullscreen";
import { useTabWarning } from "@/components/test/hooks/use-tab-warning";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export interface Question {
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface TestInterfaceProps {
  testId: string;
  testName: string;
  duration: number;
  totalQuestions: number;
  questions: Question[];
}

function onComplete(answers: Record<number, number>) {
  // Handle submission logic here
}

export function TestInterface({
  testId,
  testName,
  duration,
  totalQuestions,
  questions,
}: TestInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(duration);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { isFullscreen, isFullscreenAvailable, enterFullscreen } =
    useFullscreen();
  const { warningVisible } = useTabWarning();

  const handleAnswer = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    onComplete(answers);
    router.push(`/test/result/${testId}`);
  };

  const handleTimeUp = () => {
    onComplete(answers);
    router.push(`/test/result/${testId}`);
  };

  const handleFullscreenDecline = () => {
    toast({
      title: "Test Requirements",
      description:
        "Fullscreen mode is required to take this test. Please try again.",
      variant: "destructive",
    });
  };

  if (!testStarted && isFullscreenAvailable) {
    return (
      <FullscreenRequest
        onAccept={async () => {
          const success = await enterFullscreen();
          if (success) setTestStarted(true);
        }}
        onDecline={handleFullscreenDecline}
      />
    );
  }

  const currentQuestionData = questions[currentQuestion - 1];
  return (
    <div className="min-h-screen bg-background">
      <TestHeader
        testName={testName}
        isFullscreen={isFullscreen}
        onToggleFullscreen={enterFullscreen}
      />

      <TestWarning
        visible={warningVisible}
        message="Tab switch detected. This incident will be recorded."
      />

      <div className="container py-6">
        {warnings.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">
                  Test Violations ({warnings.length}/3)
                </p>
                <ul className="mt-2 text-sm space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
              <Badge variant="destructive">
                {3 - warnings.length} warnings remaining
              </Badge>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card rounded-lg shadow-lg p-6">
                {currentQuestionData ? (
                  <QuestionPanel
                    questionNumber={currentQuestion}
                    questionText={currentQuestionData.question}
                    options={currentQuestionData.options}
                    onAnswer={(answerId) =>
                      handleAnswer(currentQuestion, answerId)
                    }
                    selectedAnswer={answers[currentQuestion]}
                  />
                ) : (
                  <p>Question data is unavailable.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {timeLeft !== null && (
              <div className="bg-card rounded-lg shadow-lg p-4">
                <Timer
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                  onTimeUp={handleTimeUp}
                />
              </div>
            )}

            <div className="bg-card rounded-lg shadow-lg p-4">
              <TestProgress
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                answeredQuestions={Object.keys(answers).length}
              />
            </div>

            <div className="bg-card rounded-lg shadow-lg p-4">
              <QuestionNavigation
                totalQuestions={totalQuestions}
                currentQuestion={currentQuestion}
                answeredQuestions={answers}
                onQuestionSelect={setCurrentQuestion}
              />
            </div>

            <ProctorControls
              onRaiseHand={() =>
                toast({
                  title: "Hand Raised",
                  description: "The proctor has been notified.",
                })
              }
            />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-4">
          <div className="container flex justify-between items-center">
            <button
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(1, prev - 1))
              }
              disabled={currentQuestion === 1}
              className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              Previous
            </button>

            {currentQuestion === totalQuestions ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Submit Test
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have answered {Object.keys(answers).length} out of{" "}
                      {totalQuestions} questions. Are you sure you want to
                      submit?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>
                      Submit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(totalQuestions, prev + 1)
                  )
                }
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
