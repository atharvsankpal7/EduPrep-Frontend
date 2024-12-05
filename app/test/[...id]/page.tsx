// pages/test/[id]/page.tsx
"use client"
import { useEffect, useState } from "react";
import { TestInterface } from "@/components/test/test-interface";

interface TestPageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

interface TestConfig {
  testName: string;
  duration: number;
  totalQuestions: number;
  questions: Array<{ question: string; options: string[]; correctAnswer?: number }>;
}

export default function TestPage({ params }: TestPageProps) {
  const testId = params.id;
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);

  useEffect(() => {
    const fetchTestConfig = async () => {
      const response = await fetch(`${process.env.BACKEND_API}/test/getTest/${testId}`);
      if (response.ok) {
        const data = await response.json();
        setTestConfig(data);
      } else {
        console.error("Failed to fetch test data");
      }
    };

    fetchTestConfig();
  }, [testId]);

  const handleTestComplete = (answers: Record<number, number>) => {
    console.log("Test completed with answers:", answers);
  };

  if (!testConfig) {
    return <div>Loading...</div>;
  }

  return (
    <TestInterface
      testId={testId}
      testName={testConfig.testName}
      duration={testConfig.duration}
      totalQuestions={testConfig.totalQuestions}
      questions={testConfig.questions}
    />
  );
}
