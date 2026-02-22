"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TestResult } from "@/components/test/test-result";
import InvalidResult from "@/components/test/result/invalid-result";
import QuestionAnalysis from "@/components/test/result/question-analysis";
import LoadingComponent from "@/components/loading";
import { fetchTestResultById } from "@/lib/api/services/test.api";
import { TestResultData } from "@/types/global/interface/test.apiInterface";

export default function TestResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { data: rawResult, error, isLoading } = useQuery({
    queryKey: ["testResult", params.id],
    queryFn: () => fetchTestResultById(params.id),
  });

  // Derive the processed result from raw data
  const result = useMemo<TestResultData | null>(() => {
    if (!rawResult) return null;

    const sectionResults =
      rawResult.sectionResults?.map((section: any) => ({
        name: section.sectionName,
        totalQuestions: section.totalQuestions,
        correctAnswers: section.correctAnswers,
        score: (section.correctAnswers / section.totalQuestions) * 100,
        timeSpent: section.timeSpent,
      })) || [];

    return {
      ...rawResult,
      sectionResults,
      questionAnalysis: rawResult.questionAnalysis || [],
    };
  }, [rawResult]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        {error instanceof Error ? error.message : "Failed to load test result"}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-8 text-center">No result data available</div>
    );
  }

  if (result.invalid) {
    return <InvalidResult onClick={() => router.push("/test")} />;
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold ">Test Results</h1>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <TestResult
            totalQuestions={result.totalQuestions}
            correctAnswers={result.correctAnswers}
            score={(result.correctAnswers / result.totalQuestions) * 100}
            timeSpent={result.timeSpent}
            tabSwitches={result.tabSwitches || 0}
            autoSubmitted={result.autoSubmitted || false}
            sectionResults={result.sectionResults}
          />

          <QuestionAnalysis questionAnalysis={result.questionAnalysis || []} />
        </div>
      </div>
    </div>
  );
}
