"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { TestInterface } from "@/components/test/test-interface";
import LoadingComponent from "@/components/loading";
import { fetchTestById, submitTestById } from "@/lib/api/services/test.api";
import {
  TestPageProps,
  TestResponse,
  TestSection,
} from "@/types/global/interface/test.apiInterface";

export default function TestPage({ params }: TestPageProps) {
  const testId = params.id;
  const router = useRouter();

  const { data: testData, error, isLoading } = useQuery<TestResponse>({
    queryKey: ["test", testId],
    queryFn: () => fetchTestById(testId),
  });

  const handleTestComplete = useCallback(async (answers: Record<number, number>, timeSpent: number) => {
    try {
      if (!testData) return;

      const selectedAnswers: { questionId: string; selectedOption: number; sectionName: string }[] = [];
      let globalQuestionIndex = 0;

      testData.test.sections.forEach((section) => {
        section.questions.forEach((question) => {
          const selectedOption = answers[globalQuestionIndex];
          const questionId = question.id ?? question._id ?? "";

          selectedAnswers.push({
            questionId,
            selectedOption: selectedOption !== undefined ? selectedOption + 1 : -1,
            sectionName: section.sectionName,
          });

          globalQuestionIndex++;
        });
      });

      const response = await submitTestById(testId, {
        selectedAnswers,
        timeTaken: timeSpent,
        autoSubmission: {
          isAutoSubmitted: false,
          tabSwitches: 0,
        },
      });

      const testResultId =
        response?.data?.testResult?.id ??
        response?.data?.testResult?._id;
      if (!testResultId) {
        throw new Error("Missing test result id in response");
      }
      router.push(`/result/${testResultId}`);
    } catch (error) {
      console.error("Failed to submit test:", error);
    }
  }, [testData, testId, router]);

  // Memoize sections transformation to avoid re-computing on every render
  const sections: TestSection[] = useMemo(() => {
    if (!testData) return [];
    return testData.test.sections.map((section) => ({
      name: section.sectionName,
      duration: section.sectionDuration,
      questions: section.questions.map((q) => ({
        question: q.questionText,
        options: q.options,
        correctAnswer: q.answer,
        id: q.id ?? q._id ?? "",
      })),
    }));
  }, [testData]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        {error instanceof Error ? error.message : "Failed to load test. Please try again later."}
      </div>
    );
  }

  if (!testData) {
    return <div className="container py-8 text-center">No test data available</div>;
  }

  return (
    <TestInterface
      testId={testId}
      testName={testData.test.testName}
      sections={sections}
      onComplete={handleTestComplete}
    />
  );
}
