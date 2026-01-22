"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Timer } from "@/components/test/timer";
import { QuestionPanel } from "@/components/test/question-panel";
import { TestHeader } from "@/components/test/test-header";
import { TestProgress } from "@/components/test/test-progress";
import { QuestionNavigation } from "@/components/test/question-navigation";
import { TabSwitchWarningModal } from "@/components/test/tab-switch-warning-modal";
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
import { useTestStore } from "@/lib/stores/test-store";
import { WarningModal } from "@/components/test/warning-modal";

export interface Question {
  question: string;
  options: string[];
  correctAnswer?: number;
  id?: string; // Added id to track original question IDs
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
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(true);
  const [isLastWarning, setIsLastWarning] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const { toast } = useToast();
  const { tabSwitchCount, incrementTabSwitches } = useTestStore();

  // Refs for document events
  const containerRef = useRef<HTMLDivElement>(null);

  // Enter fullscreen on component mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
      } catch (error) {
        console.error("Failed to enter fullscreen:", error);
      }
    };

    if (testStarted) {
      enterFullscreen();

      // Hide navbar by adding a class to the body
      document.body.classList.add('test-mode');
    }

    // Cleanup function to exit fullscreen when component unmounts
    return () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
      // Remove the test-mode class
      document.body.classList.remove('test-mode');
    };
  }, [testStarted]);

  // Track tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && testStarted) {
        incrementTabSwitches();

        if (tabSwitchCount < 2) {
          setWarningModalOpen(true);
          setIsLastWarning(false);
          setIsAutoSubmitted(false);
        } else if (tabSwitchCount === 2) {
          setWarningModalOpen(true);
          setIsLastWarning(true);
          setIsAutoSubmitted(false);
        } else {
          setWarningModalOpen(true);
          setIsAutoSubmitted(true);
          handleSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [tabSwitchCount, incrementTabSwitches, testStarted]);

  // Prevent copy-paste
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({
        title: "Action not allowed",
        description: "Copy and paste are disabled during the test",
        variant: "destructive",
      });
    };

    if (testStarted) {
      document.addEventListener("copy", preventCopyPaste);
      document.addEventListener("paste", preventCopyPaste);
      document.addEventListener("cut", preventCopyPaste);
    }

    return () => {
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("cut", preventCopyPaste);
    };
  }, [toast, testStarted]);

  // Prevent context menu
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    if (testStarted) {
      document.addEventListener("contextmenu", preventContextMenu);
    }

    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, [testStarted]);

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
      // Add current section's time spent to total
      setTotalTimeSpent(prev => prev + (sections[currentSection].duration * 60 - timeLeft));

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
    // Calculate total time spent including current section
    const finalTimeSpent = totalTimeSpent + (sections[currentSection].duration * 60 - timeLeft);
    onComplete(answers, finalTimeSpent);
  };

  const startTest = () => {
    setShowWarningModal(false);
    setTestStarted(true);
  };

  // Current section's questions
  const currentSectionQuestions = sections[currentSection].questions;
  const currentQuestionData = currentSectionQuestions[currentQuestion];

  if (!testStarted) {
    return <WarningModal onStart={startTest} />;
  }

  return (
    <div className="min-h-screen bg-background lg:py-10 py-2" ref={containerRef}>
      <TestHeader testName={`${testName} - ${sections[currentSection].name}`} />

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
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-4 px-2">
          <div className="container flex justify-between items-center  mx-auto">
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

      {/* Tab Switch Warning Modal */}
      <TabSwitchWarningModal
        open={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        tabSwitchCount={tabSwitchCount + 1}
        isLastWarning={isLastWarning}
        isAutoSubmitted={isAutoSubmitted}
      />
    </div>
  );
}