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
import { AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IQuestion, ITestSection } from "@/lib/type";



interface TestInterfaceProps {
  testId: string;
  testName: string;
  duration: number;
  totalQuestions: number;
  sections: ITestSection[];
  areSectionsSkippable?: boolean;
  onComplete: (answers: Record<number, number>, timeSpent: number) => void;
}

export function TestInterface({
  testId,
  testName,
  duration,
  totalQuestions,
  sections,
  areSectionsSkippable = true,
  onComplete,
}: TestInterfaceProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(duration);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const { toast } = useToast();

  const { isFullscreen, isFullscreenAvailable, enterFullscreen } = useFullscreen();
  const { warningVisible } = useTabWarning();

  // Handle single section case
  const isSingleSection = sections.length === 1;
  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];

  // Check if questions are available
  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading test questions...</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (answerId: number) => {
    const questionIndex = getGlobalQuestionIndex();
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerId,
    }));
  };

  const getGlobalQuestionIndex = () => {
    let index = currentQuestion;
    for (let i = 0; i < currentSection; i++) {
      index += sections[i].totalQuestions;
    }
    return index;
  };

  const handleSubmit = () => {
    const timeSpent = duration - timeLeft;
    onComplete(answers, timeSpent);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const handleFullscreenDecline = () => {
    toast({
      title: "Test Requirements",
      description: "Fullscreen mode is required to take this test. Please try again.",
      variant: "destructive",
    });
  };

  const handleSectionChange = (sectionIndex: number) => {
    if (!areSectionsSkippable && sectionIndex > currentSection + 1) {
      toast({
        title: "Section Navigation Restricted",
        description: "You must complete the current section before moving to the next one.",
        variant: "destructive",
      });
      return;
    }
    setCurrentSection(sectionIndex);
    setCurrentQuestion(0);
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
        {!isSingleSection && (
          <div className="mb-6">
            <Tabs value={currentSection.toString()} onValueChange={(value) => handleSectionChange(parseInt(value))}>
              <TabsList>
                {sections.map((section, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    disabled={!areSectionsSkippable && index > currentSection + 1}
                  >
                    {section.sectionName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Test Violations ({warnings.length}/3)</p>
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
          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card rounded-lg shadow-lg p-6">
                <QuestionPanel
                  questionNumber={currentQuestion + 1}
                  questionText={currentQuestionData.questionText}
                  options={currentQuestionData.options}
                  onAnswer={handleAnswer}
                  selectedAnswer={answers[getGlobalQuestionIndex()]}
                />
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-lg shadow-lg p-4">
              <Timer
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                onTimeUp={handleTimeUp}
              />
            </div>

            <div className="bg-card rounded-lg shadow-lg p-4">
              <TestProgress
                currentQuestion={currentQuestion + 1}
                totalQuestions={currentSectionData.totalQuestions}
                answeredQuestions={Object.keys(answers).length}
                sectionName={currentSectionData.sectionName}
              />
            </div>

            <div className="bg-card rounded-lg shadow-lg p-4">
              <QuestionNavigation
                totalQuestions={currentSectionData.totalQuestions}
                currentQuestion={currentQuestion + 1}
                answeredQuestions={answers}
                onQuestionSelect={(num) => setCurrentQuestion(num - 1)}
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

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-4">
          <div className="container flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion === currentSectionData.questions.length - 1 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    {currentSection === sections.length - 1 ? "Submit Test" : "Next Section"}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {currentSection === sections.length - 1 ? "Submit Test?" : "Move to Next Section?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {currentSection === sections.length - 1 
                        ? `You have answered ${Object.keys(answers).length} out of ${totalQuestions} questions. Are you sure you want to submit?`
                        : "You won't be able to return to this section if section navigation is restricted. Are you sure you want to continue?"
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        if (currentSection === sections.length - 1) {
                          handleSubmit();
                        } else {
                          handleSectionChange(currentSection + 1);
                        }
                      }}
                    >
                      {currentSection === sections.length - 1 ? "Submit" : "Continue"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(currentSectionData.questions.length - 1, prev + 1)
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