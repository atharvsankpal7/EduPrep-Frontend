"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TestInfoDisplay } from "@/components/test-engine/pre-test/test-info-display";
import { TestConfigDialog } from "@/components/test-engine/pre-test/test-config-dialog";
import { ErrorMessageDialog } from "@/components/test-engine/pre-test/error-message-dialog";
import { EducationLevel, TopicList } from "@/types/global/interface/test.apiInterface";
import { CetTopicsSelector } from "@/components/custom-practice/cet-topics-selector";
import { useCetTopics } from "@/lib/api/hooks/useCetTopics";
import LoadingComponent from "@/components/loading";
import { useCreateAndNavigate } from "../use-create-and-navigate";

export default function CustomTestPage() {
  const [showConfig, setShowConfig] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<TopicList | null>(null);
  const [testConfig, setTestConfig] = useState<{
    duration: number;
    questionCount: number;
  } | null>(null);
  const router = useRouter();

  const { data: cetTopicsData, isLoading: loading } = useCetTopics();
  const cetTopics = cetTopicsData?.topicsBySubject ?? [];

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

  const startTest = async () => {
    if (!selectedTopics || !testConfig) return;

    createAndNavigate({
      educationLevel: EducationLevel.JuniorCollege,
      topicList: selectedTopics,
      numberOfQuestions: testConfig.questionCount,
      time: testConfig.duration,
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (loading || isPending) {
    return <LoadingComponent />;
  }

  if (testConfig && selectedTopics) {
    return (
      <>
        <ErrorMessageDialog open={hasError} onClose={clearError} />
        <TestInfoDisplay
          title="Custom CET Practice Test"
          description="Personalized test based on your selected topics"
          duration={testConfig.duration}
          questionCount={testConfig.questionCount}
          onStart={startTest}
          startButtonLabel={isPending ? "Creating Test..." : "Start Test"}
          isStartDisabled={isPending}
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
            <h1 className="text-3xl font-bold mb-2">Custom CET Practice Test</h1>
            <p className="text-muted-foreground">
              Create your own test by selecting specific topics from CET syllabus
            </p>
          </div>

          <CetTopicsSelector
            cetTopics={cetTopics}
            onStartTest={handleTopicsSelected}
            onBack={handleBack}
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
