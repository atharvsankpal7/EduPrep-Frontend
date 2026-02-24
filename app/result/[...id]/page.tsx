"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchTestResultById } from "@/lib/api/services/test.api";
import {
  transformTestResult,
  type RawTestResult,
} from "@/lib/api/transformers/result.transformer";

export default function TestResultPage({
  params,
}: {
  params: { id: string[] | string };
}) {
  const resultId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, isLoading, error } = useQuery<RawTestResult>({
    queryKey: queryKeys.tests.result(resultId || "pending"),
    queryFn: () => fetchTestResultById(resultId),
    enabled: Boolean(resultId),
  });

  const result = useMemo(
    () => (data ? transformTestResult(data) : null),
    [data]
  );

  if (!resultId) {
    return (
      <div className="container py-8 text-center text-destructive">
        Invalid result id.
      </div>
    );
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        {error instanceof Error ? error.message : "Failed to load result."}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-8 text-center text-muted-foreground">
        No result data available.
      </div>
    );
  }

  if (result.invalid) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Result Invalid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                This attempt was marked invalid due to integrity violations during
                the test session.
              </p>
              <Button asChild>
                <Link href="/test">Go to Test Selection</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const score = result.totalQuestions
    ? (result.correctAnswers / result.totalQuestions) * 100
    : 0;

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Result</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">Correct Answers</p>
              <p className="text-xl font-semibold tabular-nums">
                {result.correctAnswers}/{result.totalQuestions}
              </p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-xl font-semibold tabular-nums">
                {score.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">Time Spent</p>
              <p className="text-xl font-semibold tabular-nums">
                {result.timeSpent}s
              </p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">Tab Switches</p>
              <p className="text-xl font-semibold tabular-nums">
                {result.tabSwitches}
              </p>
            </div>
          </CardContent>
        </Card>

        {result.sectionResults && result.sectionResults.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Section Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.sectionResults.map((section) => (
                <div
                  key={section.name}
                  className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-4"
                >
                  <p className="font-medium">{section.name}</p>
                  <p className="text-sm tabular-nums">
                    {section.correctAnswers}/{section.totalQuestions}
                  </p>
                  <p className="text-sm tabular-nums">{section.score.toFixed(2)}%</p>
                  <p className="text-sm tabular-nums">{section.timeSpent}s</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <div className="flex justify-end">
          <Button asChild>
            <Link href="/test">Take Another Test</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
