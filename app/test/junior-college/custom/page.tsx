"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { TestConfigDialog } from "@/components/test/custom-practice/test-config-dialog";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { createTest } from "@/lib/backendCalls/createTest";
import { EducationLevel, TopicList } from "@/lib/type";
import { CetTopicsSelector } from "@/components/custom-practice/cet-topics-selector";
import { fetchCetTopics, CetSubjectTopics } from "@/lib/backendCalls/fetchCetTopics";
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
  const [cetTopics, setCetTopics] = useState<CetSubjectTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        const response = await fetchCetTopics();
        setCetTopics(response.topicsBySubject);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load topics. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [toast]);

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
    console.log("Selected Topics:", selectedTopics.subjects);
    try {
      const response = await createTest({
        educationLevel: EducationLevel.JuniorCollege,
        topicList: selectedTopics.subjects.map(subject=>{subject.topics.map(topic=>topic)}),
        numberOfQuestions: testConfig.questionCount,
        time: testConfig.duration,
      }) as any;

      if (!response.testId) {
        throw new Error("Failed to create test");
      }
      router.push(`/test/${response.testId}`);
    } catch (error) {
      setShowError(true);
    }
  };

  const handleBack = () => {
    router.push("/test/junior-college");
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