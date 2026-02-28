"use client";

import { useState } from "react";
import { CustomizedTest } from "@/components/custom-practice/customized-test";
import { TestInfoDisplay } from "@/components/test-engine/pre-test/test-info-display";
import { TestConfigDialog } from "@/components/test-engine/pre-test/test-config-dialog";
import { ErrorMessageDialog } from "@/components/test-engine/pre-test/error-message-dialog";
import { EducationLevel, TopicList } from "@/types/global/interface/test.apiInterface";
import { undergraduateSubjects } from "@/lib/data/undergraduate-subjects";
import { useCreateAndNavigate } from "@/app/test/junior-college/use-create-and-navigate";

export default function CustomTestPage() {
  const [showConfig, setShowConfig] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<TopicList | null>(null);
  const [testConfig, setTestConfig] = useState<{
    duration: number;
    questionCount: number;
  } | null>(null);
  const { createAndNavigate, isPending, hasError, clearError } =
    useCreateAndNavigate();

  const handleTopicsSelected = (topics: TopicList) => {
    setSelectedTopics(topics);
    setShowConfig(true);
  };

  const handleConfigConfirmed = (config: {
    duration: number;
    questionCount: number;
  }) => {
    setTestConfig(config);
    setShowConfig(false);
  };

  const startTest = () => {
    if (!selectedTopics || !testConfig) return;

    createAndNavigate({
      educationLevel: EducationLevel.Undergraduate,
      topicList: selectedTopics,
      numberOfQuestions: testConfig.questionCount,
      time: testConfig.duration,
    });
  };

  if (testConfig && selectedTopics) {
    return (
      <>
        <ErrorMessageDialog open={hasError} onClose={clearError} />
        <TestInfoDisplay
          title="Custom Practice Test"
          description="Personalized test based on your selected topics"
          duration={testConfig.duration}
          questionCount={testConfig.questionCount}
          onStart={startTest}
          startButtonLabel={isPending ? "Starting Test..." : "Start Test"}
          isStartDisabled={isPending}
          isStartLoading={isPending}
          requirements={[
            "Working webcam and microphone",
            "Stable internet connection",
            "Quiet environment",
          ]}
        />
      </>
    );
  }

  return (
    <>
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Custom Practice Test</h1>
            <p className="text-muted-foreground">
              Create your own test by selecting specific topics and subjects
            </p>
          </div>

          <CustomizedTest
            onBack={() => window.history.back()}
            subjects={undergraduateSubjects}
            onStartTest={handleTopicsSelected}
          />
        </div>
      </div>

      <TestConfigDialog
        open={showConfig}
        onOpenChange={setShowConfig}
        onConfirm={handleConfigConfirmed}
        selectedTopics={selectedTopics?.subjects.flatMap((s) => s.topics) ?? []}
      />
    </>
  );
}
