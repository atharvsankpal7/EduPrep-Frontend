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

interface ApiResponse {
  statusCode: number;
  data: {
    test: {
      _id: string;
      testName: string;
      totalDuration: number;
      totalQuestions: number;
      sections: {
        sectionName: string;
        sectionDuration: number;
        totalQuestions: number;
        questions: {
          _id: string;
          questionText: string;
          options: string[];
          answer: number;
          explanation: string;
        }[];
      }[];
    };
  };
  message: string;
  success: boolean;
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
  const [testData, setTestData] = useState<ApiResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:5000/api/v1/test";

    const fetchTestConfig = async () => {
      try {
        setLoading(true);
        const url = `${BACKEND_URL}/${testId}`;
        const response = await axios.get<ApiResponse>(url, {
          withCredentials: true,
        });
        console.log("Response data:", response.data);

        if (!response.data.success || !response.data.data.test) {
          throw new Error("Invalid test data received");
        }

        setTestData(response.data.data);
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

  const handleTestComplete = async (
    answers: Record<number, number>,
    timeSpent: number
  ) => {
    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:5000/api/v1/test";

      if (!testData) return;

      // Create an array of all question objects with their _id to match with answers
      const allQuestions: { _id: string; index: number }[] = [];

      testData.test.sections.forEach((section) => {
        section.questions.forEach((question, questionIndex) => {
          allQuestions.push({
            _id: question._id,
            index: allQuestions.length, // Global index for matching with answers
          });
        });
      });

      // Map answers to match backend expectation
      const selectedAnswers = allQuestions.map((question, index) => ({
        questionId: question._id,
        selectedOption: answers[index] || 0, // Use the index to get the selected answer
      }));

      console.log("Submitting answers:", selectedAnswers);

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

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">{error}</div>
    );
  }

  if (!testData) {
    return (
      <div className="container py-8 text-center">No test data available</div>
    );
  }

  // Transform the test data into sections format for the TestInterface component
  const sections: TestSection[] = testData.test.sections.map((section) => {
    // Map section questions directly from the API response
    const sectionQuestions = section.questions.map((question) => {
      return {
        question: question.questionText,
        options: question.options,
        correctAnswer: question.answer,
      };
    });

    return {
      name: section.sectionName,
      duration: section.sectionDuration,
      questions: sectionQuestions,
    };
  });

  return (
    <TestInterface
      testId={testId}
      testName={testData.test.testName}
      sections={sections}
      onComplete={handleTestComplete}
    />
  );
}
