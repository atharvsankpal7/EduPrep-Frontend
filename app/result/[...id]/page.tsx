"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Medal,
  Timer,
  CheckCircle,
  XOctagon,
  Lightbulb,
  ArrowRightCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { TestResult } from "@/components/test/test-result";
import InvalidResult from "@/components/test/result/invalid-result";

interface TestResult {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  invalid: boolean;
}

const LoadingState = () => (
  <div className="container py-12">
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h2 className="text-2xl font-semibold">Loading Results</h2>
      <p className="text-muted-foreground">Please wait while we fetch your test results...</p>
    </div>
  </div>
);



export default function TestResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  useEffect(() => {
    // In a real app, fetch results from API
    const mockResult: TestResult = {
      id: params.id,
      totalQuestions: 65,
      correctAnswers: 41,
      timeSpent: 150,
      invalid: false,
    };
    setResult(mockResult);
  }, [params.id]);

  if (!result) {
    return <LoadingState />;
  }
  if (result.invalid) {
    return <InvalidResult onClick={() => router.push("/test")} />;
  }
  const accuracy = (result.correctAnswers / result.totalQuestions) * 100;
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <Medal className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Test Completed! </h1>
          <p className="text-muted-foreground">
            Here&apos;s how you performed in your test
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {result.correctAnswers} / {result.totalQuestions}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Percentage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{accuracy.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Timer className="w-5 h-5 text-primary" />
                Time Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.timeSpent} min</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {result.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Correct Answers
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <XOctagon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {result.totalQuestions - result.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Incorrect Answers
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/test")} className="gap-2">
            Take Another Test <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
