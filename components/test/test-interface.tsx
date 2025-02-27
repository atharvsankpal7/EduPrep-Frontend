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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Question {
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface Section {
  name: string;
  duration: number;
  questions: Question[];
}

export interface TestInterfaceProps {
  testId: string;
  testName: string;
  sections: Section[];
  onComplete: (answers: Record<number, number>, timeSpent: number) => void;
}

export function TestInterface({
  testId,
  testName,
  sections,
  onComplete,
}: TestInterfaceProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(sections[0].duration * 60);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [sectionCompleted, setSectionCompleted] = useState<boolean[]>(
    new Array(sections.length).fill(false)
  );
  const { toast } = useToast();

  const { isFullscreen, isFullscreenAvailable, enterFullscreen } = useFullscreen();
  const { warningVisible } = useTabWarning();

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
      index += sections[i].questions.length;
    }
    return index;
  };

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      const newSectionCompleted = [...sectionCompleted];
      newSectionCompleted[currentSection] = true;
      setSectionCompleted(newSectionCompleted);
      
      // Show warning dialog before proceeding
      const dialog = document.getElementById('section-warning-dialog') as HTMLButtonElement;
      if (dialog) {
        dialog.click();
      }
    }
  };

  const confirmNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      setTimeLeft(sections[currentSection + 1].duration * 60);
      toast({
        title: "New Section Started",
        description: `You are now in ${sections[currentSection + 1].name}`,
      });
    }
  };

  const handleTimeUp = () => {
    if (currentSection < sections.length - 1) {
      handleNextSection();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const totalTimeSpent = sections.reduce((total, section, index) => {
      return total + (section.duration * 60 - (index === currentSection ? timeLeft : 0));
    }, 0);
    onComplete(answers, totalTimeSpent);
  };

  // Current section's questions
  const currentSectionQuestions = sections[currentSection].questions;
  const currentQuestionData = currentSectionQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <TestHeader
        testName={`${testName} - ${sections[currentSection].name}`}
        isFullscreen={isFullscreen}
        onToggleFullscreen={enterFullscreen}
      />

      <div className="container py-6">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Section: {sections[currentSection].name}
            </h2>
            {currentSection < sections.length - 1 && (
              <Button
                onClick={handleNextSection}
                variant="outline"
              >
                Next Section
              </Button>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            {sections.map((section, index) => (
              <Badge
                key={index}
                variant={index === currentSection ? "default" : "outline"}
                className={cn(
                  sectionCompleted[index] ? "opacity-50" : "",
                  "transition-all duration-300"
                )}
              >
                {section.name}
              </Badge>
            ))}
          </div>
        </div>

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
                  questionText={currentQuestionData.question}
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
                totalQuestions={currentSectionQuestions.length}
                answeredQuestions={
                  Object.keys(answers).filter((key) => {
                    const questionIndex = parseInt(key);
                    let prevQuestionsCount = 0;
                    for (let i = 0; i < currentSection; i++) {
                      prevQuestionsCount += sections[i].questions.length;
                    }
                    return (
                      questionIndex >= prevQuestionsCount &&
                      questionIndex < prevQuestionsCount + currentSectionQuestions.length
                    );
                  }).length
                }
              />
            </div>

            <div className="bg-card rounded-lg shadow-lg p-4">
              <QuestionNavigation
                totalQuestions={currentSectionQuestions.length}
                currentQuestion={currentQuestion + 1}
                answeredQuestions={answers}
                onQuestionSelect={(num) => setCurrentQuestion(num - 1)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-4">
          <div className="container flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion === currentSectionQuestions.length - 1 ? (
              currentSection === sections.length - 1 ? (
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
                        Are you sure you want to submit the test? This action cannot be undone.
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
                <Button onClick={handleNextSection}>Next Section</Button>
              )
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(currentSectionQuestions.length - 1, prev + 1)
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

      {/* Section Warning Dialog */}
      <AlertDialog>
        <AlertDialogTrigger id="section-warning-dialog" className="hidden" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Warning: Section Change
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to move to the next section. Please note:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>You cannot return to the previous section once you proceed</li>
                <li>All unanswered questions in the current section will be marked as not attempted</li>
                <li>Make sure you have reviewed all your answers</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay in Current Section</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNextSection}>
              Proceed to Next Section
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}