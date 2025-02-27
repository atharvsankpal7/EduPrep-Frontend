"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestInterface } from "@/components/test/test-interface";
import { IQuestion, ITest, ITestSection } from "@/lib/type";
import axios from "axios";

interface TestPageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

interface TestConfig {
  test: {
    id: string;
    testName: string;
    testDuration: number;
    totalQuestions: number;
    sections: ITestSection[];
    areSectionsSkippable?: boolean;
  };
}

export default function TestPage({ params }: TestPageProps) {
  const testId = params.id;
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:5000/api/v1/test";

    const fetchTestConfig = async () => {
      try {
        const url = `${BACKEND_URL}/${testId}`;
        const response = await axios.get(url);
        const data = response.data.data;

        if (!data.test || !data.test.sections) {
          throw new Error("Invalid test data received");
        }

        // Transform the data to match the TestInterface requirements
        const transformedConfig: TestConfig = {
          test: {
            id: data.test.id,
            testName: data.test.testName,
            testDuration: data.test.testDuration,
            totalQuestions: data.test.totalQuestions,
            sections: data.test.sections.map((section: ITestSection) => ({
              name: section.sectionName,
              duration: section.sectionDuration,
              questionCount: section.totalQuestions,
              questions: section.questions.map((q: IQuestion) => ({
                question: q.questionText,
                options: q.options,
                correctAnswer: q.answer,
              })),
            })),
            areSectionsSkippable: data.test.areSectionsSkippable ?? true,
          },
        };

        setTestConfig(transformedConfig);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch test data:", error);
        setError("Failed to load test. Please try again later.");
      }
    };

    fetchTestConfig();
  }, [testId]);

  const handleTestComplete = async (
    answers: Record<number, number>,
    timeSpent: number
  ) => {
    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000/api/v1/test";

      // Format answers to match backend expectations
      const selectedAnswers = Object.entries(answers).map(
        ([index, answer]) => ({
          questionId: testConfig?.test.sections.flatMap((s) => s.questions)[
            parseInt(index)
          ].id,
          selectedOption: answer,
        })
      );

      // Submit test
      await axios.patch(
        `${BACKEND_URL}/${testId}/submit`,
        {
          selectedAnswers,
          timeTaken: Math.floor(timeSpent / 60), // Convert to minutes
          autoSubmission: {
            isAutoSubmitted: false,
            tabSwitches: 0,
          },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Redirect to results page
      router.push(`/result/${testId}`);
    } catch (error) {
      console.error("Failed to submit test:", error);
      setError("Failed to submit test. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!testConfig) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TestInterface
      testId={testConfig.test.id}
      testName={testConfig.test.testName}
      duration={testConfig.test.testDuration}
      totalQuestions={testConfig.test.totalQuestions}
      sections={testConfig.test.sections}
      areSectionsSkippable={testConfig.test.areSectionsSkippable}
      onComplete={handleTestComplete}
    />
  );
}
