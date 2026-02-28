"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import LoadingComponent from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTestResult } from "@/lib/api/hooks/useTestResult";
import { ResultReviewShell } from "@/components/test-engine/result-review-shell";

export default function TestResultPage({
  params,
}: {
  params: { id: string[] | string };
}) {
  const resultId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: result, isLoading, error } = useTestResult(resultId ?? "");

  // ─── Missing ID ──────────────────────────────────────────
  if (!resultId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <Card className="border-destructive/40">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <AlertTriangle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Invalid result URL — no result ID found.
            </p>
            <Button asChild variant="outline">
              <Link href="/test">Back to Tests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Loading ─────────────────────────────────────────────
  if (isLoading) {
    return <LoadingComponent />;
  }

  // ─── Error ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <Card className="border-destructive/40">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <AlertTriangle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Failed to load result."}
            </p>
            <Button asChild variant="outline">
              <Link href="/test">Back to Tests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── No data ─────────────────────────────────────────────
  if (!result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <Card>
          <CardContent className="p-8 text-muted-foreground">
            No result data available.
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Invalid attempt ─────────────────────────────────────
  if (result.invalid) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Result Invalidated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              This attempt was marked invalid due to integrity violations during
              the test session.
            </p>
            {result.tabSwitches > 0 && (
              <p className="text-xs">
                Tab switches recorded: <strong>{result.tabSwitches}</strong>
              </p>
            )}
            <Button asChild>
              <Link href="/test">
                <ArrowLeft className="mr-1.5 size-4" />
                Go to Test Selection
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Review shell (reuses test engine layout) ────────────
  return <ResultReviewShell result={result} />;
}
