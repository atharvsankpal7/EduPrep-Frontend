"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TestInterface } from "@/components/test/test-interface";
import LoadingComponent from "@/components/loading";
import { queryKeys } from "@/lib/api/query-keys";
import {
  buildSubmissionPayload,
  transformTestSections,
} from "@/lib/api/transformers/test.transformer";
import { fetchTestById, submitTestById } from "@/lib/api/services/test.api";
import type { AutoSubmissionMeta } from "@/hooks/use-test-engine";
import type {
  TestPageProps,
  TestResponse,
} from "@/types/global/interface/test.apiInterface";

const TEST_STALE_TIME = 2 * 60 * 1000;
const TEST_GC_TIME = 30 * 60 * 1000;

export default function TestPage({ params }: TestPageProps) {
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const testId = (rawId || "").trim();
  const router = useRouter();
  const isValidTestId = testId.length > 0;

  const {
    data: testData,
    error,
    isLoading,
  } = useQuery<TestResponse>({
    queryKey: queryKeys.tests.detail(isValidTestId ? testId : "pending"),
    queryFn: () => fetchTestById(testId),
    enabled: isValidTestId,
    staleTime: TEST_STALE_TIME,
    gcTime: TEST_GC_TIME,
  });

  const handleTestComplete = useCallback(
    async (
      answers: Record<number, number>,
      timeSpent: number,
      autoSubmission: AutoSubmissionMeta
    ) => {
      try {
        if (!testData) {
          return;
        }

        const payload = buildSubmissionPayload(
          testData,
          answers,
          timeSpent,
          autoSubmission
        );
        const response = await submitTestById(testId, payload);
        const testResultId =
          response?.data?.testResult?.id ??
          response?.data?.testResult?._id;

        if (!testResultId) {
          throw new Error("Missing test result id in response");
        }

        router.push(`/result/${testResultId}`);
      } catch (submissionError) {
        console.error("Failed to submit test:", submissionError);
      }
    },
    [router, testData, testId]
  );

  const sections = useMemo(
    () => (testData ? transformTestSections(testData) : []),
    [testData]
  );

  if (!isValidTestId) {
    return (
      <div className="container py-8 text-center text-destructive">
        Invalid test id
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        {error instanceof Error
          ? error.message
          : "Failed to load test. Please try again later."}
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="container py-8 text-center">
        No test data available
      </div>
    );
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
