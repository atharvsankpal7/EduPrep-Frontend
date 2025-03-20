"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestInterface } from "@/components/test/test-interface";
import axios from "axios";
import LoadingComponent from "@/components/loading";
import { BACKEND_URL } from "@/lib/constant";
import { useAuthStore } from "@/lib/stores/auth-store";

interface TestPageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

interface TestResponse {
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
}

interface TestSection {
  name: string;
  duration: number;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    id: string; // Added id to track original question IDs
  }[];
}

export default function TestPage({ params }: TestPageProps) {
  const testId = params.id;
  const [testData, setTestData] = useState<TestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user  = useAuthStore.getState().user;
    if(!user) {
      router.push("/sign-up");
    }

    const fetchTestConfig = async () => {
      try {
        setLoading(true);
        const url = `${BACKEND_URL}/test/${testId}`;
        console.log("url", url);
        const response = await axios.get(url, {
          withCredentials: true,
        });
        
        const responseData = response.data.data;
        console.log(responseData);
        
        if (!responseData.test) {
          throw new Error("Invalid test data received");
        }

        setTestData(responseData);
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
      
      if (!testData) return;
      
      // Create a map to track all question answers
      const selectedAnswers: { questionId: string, selectedOption: number, sectionName: string }[] = [];
      
      let globalQuestionIndex = 0;
      
      testData.test.sections.forEach(section => {
        section.questions.forEach(question => {
          const selectedOption = answers[globalQuestionIndex] !== undefined ? answers[globalQuestionIndex] : 0;
          
          selectedAnswers.push({
            questionId: question._id,
            selectedOption: selectedOption,
            sectionName: section.sectionName
          });
          
          globalQuestionIndex++;
        });
      });

      // Submit test
     const response =  await axios.patch(`${BACKEND_URL}/test/${testId}/submit`, {
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
      console.log("response from submitted result",response.data.data.testResult._id);
      // Redirect to results page
      router.push(`/result/${response.data.data.testResult._id}`);
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

  if (!testData) {
    return <div className="container py-8 text-center">No test data available</div>;
  }

  // Transform the test data into sections format for the TestInterface component
  const sections: TestSection[] = testData.test.sections.map(section => {
    return {
      name: section.sectionName,
      duration: section.sectionDuration,
      questions: section.questions.map(q => ({
        question: q.questionText,
        options: q.options,
        correctAnswer: q.answer,
        id: q._id
      }))
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