"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { TestConfigDialog } from "@/components/test/custom-practice/test-config-dialog";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { useCreateTest } from "@/lib/api/hooks/useCreateTest";
import { EducationLevel, TopicList } from "@/types/global/interface/test.apiInterface";
import { CetTopicsSelector } from "@/components/custom-practice/cet-topics-selector";
import { useCetTopics } from "@/lib/api/hooks/useCetTopics";
import { useToast } from "@/components/ui/use-toast";
import LoadingComponent from "@/components/loading";

export default function CustomTestPage() {
  const [showConfig, setShowConfig] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<TopicList | null>(null);
  const [testConfig, setTestConfig] = useState<{
    duration: number;
    questionCount: number;
  } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // TanStack Query for fetching CET topics
  const { data: cetTopicsData, isLoading: loading } = useCetTopics();
  const cetTopics = cetTopicsData?.topicsBySubject ?? [];

  // TanStack mutation for creating tests
  const createTestMutation = useCreateTest();

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

    createTestMutation.mutate(
      {
        educationLevel: EducationLevel.JuniorCollege,
        topicList: selectedTopics,
        numberOfQuestions: testConfig.questionCount,
        time: testConfig.duration,
      },
      {
        onSuccess: (response: any) => {
          const testId = response?.data?.testDetails?.testId;
          if (!testId) {
            setShowError(true);
            return;
          }
          router.push(`/test/${testId}`);
        },
        onError: () => {
          setShowError(true);
          toast({
            title: "Error",
            description: "Failed to create test. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (testConfig && selectedTopics) {
    return (
      <>
        <ErrorMessageDialog open={showError} onClose={() => setShowError(false)} />
        <TestInfoDisplay
          title="Custom CET Practice Test"
          description="Personalized test based on your selected topics"
          duration={testConfig.duration}
          questionCount={testConfig.questionCount}
          onStart={startTest}
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
