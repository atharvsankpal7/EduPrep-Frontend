"use client";

import { QuestionPanel } from "@/components/test/question-panel";
import { TestHeader } from "@/components/test/test-header";
import { QuestionNavigation } from "@/components/test/question-navigation";
import { TabSwitchWarningModal } from "@/components/test/tab-switch-warning-modal";
import { useToast } from "@/components/ui/use-toast";
import { WarningModal } from "@/components/test/warning-modal";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Surface } from "@/components/common/surface";
import { useTestEngine, type AutoSubmissionMeta } from "@/hooks/use-test-engine";
import { useProctoring } from "@/hooks/use-proctoring";
import { SectionInfoBar } from "@/components/test/section-info-bar";
import { TestFooter } from "@/components/test/test-footer";
import { SectionChangeDialog } from "@/components/test/section-change-dialog";
import type { TestSection } from "@/types/global/interface/test.apiInterface";

export interface Question {
  question: string;
  options: string[];
  correctAnswer?: number;
  id?: string;
}

export interface TestInterfaceProps {
  testId: string;
  testName: string;
  sections: TestSection[];
  onComplete: (
    answers: Record<number, number>,
    timeSpent: number,
    autoSubmission: AutoSubmissionMeta
  ) => void;
}

export function TestInterface({
  testId: _testId,
  testName,
  sections,
  onComplete,
}: TestInterfaceProps) {
  const { toast } = useToast();
  const engine = useTestEngine({ sections, onComplete });
  const proctoring = useProctoring({
    enabled: engine.testStarted,
    onAutoSubmit: ({ tabSwitchCount }) => {
      engine.submitTest({
        isAutoSubmitted: true,
        tabSwitches: tabSwitchCount,
      });
    },
    onViolation: (type) => {
      if (type === "clipboard") {
        toast({
          title: "Action not allowed",
          description: "Copy and paste are disabled during the test",
          variant: "destructive",
        });
      }
    },
  });

  const currentSectionName = sections[engine.currentSection]?.name ?? "Section";
  const currentSectionDuration = (sections[engine.currentSection]?.duration ?? 0) * 60;

  const handleSectionChangeConfirm = () => {
    const nextSectionIndex = engine.confirmNextSection();
    if (nextSectionIndex === null) {
      return;
    }

    const nextSectionName = sections[nextSectionIndex]?.name;
    if (nextSectionName) {
      toast({
        title: "New Section Started",
        description: `You are now in ${nextSectionName}`,
      });
    }
  };

  const handleManualSubmit = () => {
    engine.submitTest({
      isAutoSubmitted: false,
      tabSwitches: proctoring.tabSwitchCount,
    });
  };

  if (!engine.testStarted) {
    return <WarningModal onStart={engine.startTest} />;
  }

  return (
    <div className="min-h-screen bg-background py-2 lg:py-8">
      <TestHeader testName={`${testName} - ${currentSectionName}`} />

      <PageWrapper>
        <SectionInfoBar
          sectionName={currentSectionName}
          sections={sections}
          currentSectionIndex={engine.currentSection}
          sectionCompleted={engine.sectionCompleted}
          totalTime={currentSectionDuration}
          onTimeUp={() =>
            engine.handleTimeUp({
              isAutoSubmitted: false,
              tabSwitches: proctoring.tabSwitchCount,
            })
          }
          onTimeChange={engine.updateTimeLeft}
          showNextSection={!engine.isLastSection}
          onNextSection={engine.requestNextSection}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <div key={engine.currentGlobalQuestionIndex}>
              <Surface className="p-5 lg:p-6">
                <QuestionPanel
                  questionNumber={engine.currentQuestion + 1}
                  questionText={engine.currentQuestionData.question}
                  options={engine.currentQuestionData.options}
                  onAnswer={engine.selectAnswer}
                  selectedAnswer={engine.selectedAnswer}
                  isMarkedForReview={engine.isCurrentMarkedForReview}
                  onToggleReview={engine.toggleReview}
                />
              </Surface>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <Surface className="p-4">
              <QuestionNavigation
                questionStatuses={engine.questionStatuses}
                currentQuestion={engine.currentQuestion + 1}
                onQuestionSelect={engine.navigateToQuestion}
              />
            </Surface>
          </div>
        </div>

        <TestFooter
          currentQuestion={engine.currentQuestion}
          totalQuestions={engine.currentSectionQuestions.length}
          isFirstQuestion={engine.isFirstQuestion}
          isLastQuestionInSection={engine.isLastQuestionInSection}
          isLastSection={engine.isLastSection}
          onPrevious={engine.previousQuestion}
          onNext={engine.nextQuestion}
          onNextSection={engine.requestNextSection}
          onSubmit={handleManualSubmit}
        />
      </PageWrapper>

      <SectionChangeDialog
        open={engine.sectionChangeRequested}
        onOpenChange={(open) => {
          if (!open) {
            engine.cancelSectionChange();
          }
        }}
        onConfirm={handleSectionChangeConfirm}
      />

      <TabSwitchWarningModal
        open={proctoring.warningModalOpen}
        onClose={proctoring.dismissWarning}
        tabSwitchCount={proctoring.tabSwitchCount}
        isLastWarning={proctoring.isLastWarning}
        isAutoSubmitted={proctoring.isAutoSubmitted}
      />
    </div>
  );
}
