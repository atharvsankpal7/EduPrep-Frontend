"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestInterface } from "@/components/test/test-interface";
import { IQuestion, ITest } from "@/lib/type";
import axios from "axios";
import LoadingComponent from "@/components/loading";

interface TestPageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

interface TestConfig {
  test: ITest;
  questions: IQuestion[];
}

interface TestSection {
  name: string;
  duration: number;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export default function TestPage({ params }: TestPageProps) {
  const testId = params.id;
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1/test";

    const fetchTestConfig = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchTestConfig();
  }, [testId]);

  const handleTestComplete = async (answers: Record<number, number>, timeSpent: number) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1/test";
      
      if (!testConfig) return;
      
      // Organize answers by section
      const sectionAnswers: Record<string, { questionId: string, selectedOption: number, sectionName: string }[]> = {};
      
      let globalQuestionIndex = 0;
      testConfig.test.sections.forEach(section => {
        sectionAnswers[section.sectionName] = [];
        
        for (let i = 0; i < section.questions.length; i++) {
          const questionId = section.questions[i];
          const answer = answers[globalQuestionIndex] || 0;
          
          sectionAnswers[section.sectionName].push({
            questionId,
            selectedOption: answer,
            sectionName: section.sectionName
          });
          
          globalQuestionIndex++;
        }
      });
      
      // Flatten the section answers for submission
      const selectedAnswers = Object.values(sectionAnswers).flat();

      // Submit test
      await axios.patch(`${BACKEND_URL}/${testId}/submit`, {
        selectedAnswers,
        timeTaken: Math.floor(timeSpent / 60), // Convert to minutes
        autoSubmission: {
          isAutoSubmitted: false,
          tabSwitches: 0
        }
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Redirect to results page
      router.push(`/result/${testId}`);
    } catch (error) {
      console.error("Failed to submit test:", error);
      setError("Failed to submit test. Please try again.");
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div className="container py-8 text-center text-destructive">{error}</div>;
  }

  if (!testConfig) {
    return <div className="container py-8 text-center">No test data available</div>;
  }

  // Transform the test data into sections format for the TestInterface component
  const sections: TestSection[] = testConfig.test.sections.map(section => {
    // Find questions for this section
    const sectionQuestions = section.questions.map(questionId => {
      const question = testConfig.questions.find(q => q.id === questionId);
      if (!question) {
        return {
          question: "Question not found",
          options: ["Option not available"],
          correctAnswer: 0
        };
      }
      
      return {
        question: question.questionText,
        options: question.options,
        correctAnswer: question.answer,
      };
    });
    
    return {
      name: section.sectionName,
      duration: section.sectionDuration,
      questions: sectionQuestions
    };
  });

  return (
    <TestInterface
      testId={testId}
      testName={testConfig.test.testName}
      sections={sections}
      onComplete={handleTestComplete}
    />
  );
}