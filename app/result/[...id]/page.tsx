"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestResult } from "@/components/test/test-result";
import InvalidResult from "@/components/test/result/invalid-result";
import axios from "axios";

interface TestResultData {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  invalid: boolean;
}

export default function TestResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<TestResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1/test";
        const response = await axios.get(`${BACKEND_URL}/${params.id}/result`);
        setResult(response.data.data);
      } catch (error) {
        console.error("Failed to fetch test result:", error);
        setError("Failed to load test result");
      }
    };

    fetchResult();
  }, [params.id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!result) {
    return <div className="loading">Loading results...</div>;
  }

  if (result.invalid) {
    return <InvalidResult onClick={() => router.push("/test")} />;
  }

  return (
    <TestResult
      totalQuestions={result.totalQuestions}
      correctAnswers={result.correctAnswers} 
      score={(result.correctAnswers / result.totalQuestions) * 100}
      timeSpent={result.timeSpent}
      tabSwitches={0}
      autoSubmitted={result.invalid}
    />
  );
}