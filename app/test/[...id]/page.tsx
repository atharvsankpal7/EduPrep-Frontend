"use client";
import { useEffect, useState } from "react";
import { TestInterface } from "@/components/test/test-interface";
import { IQuestion, ITest } from "@/lib/type";
import axios from "axios";
import { useRouter } from "next/navigation";

interface TestPageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

interface TestConfig {
  test: ITest;
  questions: IQuestion[];
}

export default function TestPage({ params }: TestPageProps) {
  const testId = params.id;
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1/test";

    const fetchTestConfig = async () => {
      try {
        const url = `${BACKEND_URL}/${testId}`;
        const response = await axios.get(url);
        const { test, questions } = response.data.data;
        if (!test || !questions) {
          throw new Error("Invalid test data received");
        }

        setTestConfig({ test, questions });
        setError(null);
      } catch (error) {
        console.error("Failed to fetch test data:", error);
        setError("Failed to load test. Please try again later.");
      }
    };

    fetchTestConfig();
  }, [testId]);

  const handleTestComplete = async (answers: Record<number, number>, timeSpent: number) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1/test";
      
      // Format answers for API
      const selectedAnswers = Object.entries(answers).map(([index, option]) => ({
        questionId: testConfig?.questions[parseInt(index)]._id,
        selectedOption: option
      }));

      // Submit test
      await axios.patch(`${BACKEND_URL}/${testId}/submit`, {
        selectedAnswers,
        timeTaken: Math.floor(timeSpent / 60), // Convert to minutes
        autoSubmission: {
          isAutoSubmitted: false,
          tabSwitches: 0
        }
      });

      // Redirect to results page
      router.push(`/result/${testId}`);
    } catch (error) {
      console.error("Failed to submit test:", error);
      setError("Failed to submit test. Please try again.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!testConfig) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <TestInterface
      testId={testId}
      testName={testConfig.test.testName}
      duration={testConfig.test.testDuration}
      totalQuestions={testConfig.test.totalQuestions}
      questions={testConfig.questions.map((question) => ({
        question: question.questionText,
        options: question.options,
        correctAnswer: question.answer,
      }))}
      onComplete={handleTestComplete}
    />
  );
}