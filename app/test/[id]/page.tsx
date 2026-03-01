"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading";
import { TestEngineShell } from "@/components/test-engine/test-engine-shell";
import { useSubmitTest } from "@/lib/api/hooks/useSubmitTest";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchTestById } from "@/lib/api/services/test.api";
import { normalizeEngineTest } from "@/lib/test-engine/transformers";
import type {
  SubmitTestPayload,
  TestResponse,
} from "@/types/global/interface/test.apiInterface";

interface TestSessionPageProps {
  params: { id: string };
}

interface SubmitResponseShape {
  data?: {
    testResult?: {
      id: string;
    };
  };
}

const TEST_STALE_TIME = 2 * 60 * 1000;
const TEST_GC_TIME = 30 * 60 * 1000;

export default function TestSessionPage({ params }: TestSessionPageProps) {
  const router = useRouter();
  const testId = params.id.trim();
  const submitTestMutation = useSubmitTest();

  const { data, error, isLoading } = useQuery<TestResponse>({
    queryKey: queryKeys.tests.detail(testId || "pending"),
    queryFn: () => fetchTestById(testId),
    enabled: testId.length > 0,
    staleTime: TEST_STALE_TIME,
    gcTime: TEST_GC_TIME,
  });

  const normalizedTest = useMemo(
    () => (data ? normalizeEngineTest(data) : null),
    [data]
  );

  const handleSubmit = useCallback(
    async (payload: SubmitTestPayload) => {
      const response = (await submitTestMutation.mutateAsync({
        testId,
        payload,
      })) as SubmitResponseShape;

      const resultId = response.data?.testResult?.id;

      if (!resultId) {
        throw new Error("Submission succeeded but result id was missing.");
      }

      router.replace(`/result/${resultId}`);
    },
    [router, submitTestMutation, testId]
  );

  if (testId.length === 0) {
    return (
      <div className="container py-8 text-center text-destructive">
        Invalid test session id.
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
          : "Failed to load test session."}
      </div>
    );
  }

  if (!normalizedTest) {
    return (
      <div className="container py-8 text-center">
        No test data available for this session.
      </div>
    );
  }

  if (submitTestMutation.isSuccess) {
    return <LoadingComponent />;
  }

  return (
    <TestEngineShell
      test={normalizedTest}
      isSubmitting={submitTestMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}
