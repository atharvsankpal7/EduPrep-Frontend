"use client";

import { useState } from "react";
import { CustomizedTest } from "@/components/custom-practice/customized-test";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { TestConfigDialog } from "@/components/test/custom-practice/test-config-dialog";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { useCreateTest } from "@/lib/api/hooks/useCreateTest";
import { EducationLevel, TopicList } from "@/lib/type";
import { undergraduateSubjects } from "@/lib/data/undergraduate-subjects";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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

  const startTest = () => {
    if (!selectedTopics || !testConfig) return;

    createTestMutation.mutate(
      {
        educationLevel: EducationLevel.Undergraduate,
        topicList: selectedTopics,
        numberOfQuestions: testConfig.questionCount,
        time: testConfig.duration,
      },
      {
        onSuccess: (response: any) => {
          const testId = response?.data?.testDetails?.testId ?? response?.testId;
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

  if (testConfig && selectedTopics) {
    return (
      <>
        <ErrorMessageDialog
          open={showError}
          onClose={() => setShowError(false)}
        />
        <TestInfoDisplay
          title="Custom Practice Test"
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
