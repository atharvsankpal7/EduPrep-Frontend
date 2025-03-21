"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestResult } from "@/components/test/test-result";
import InvalidResult from "@/components/test/result/invalid-result";
import QuestionAnalysis from "@/components/test/result/question-analysis";
import axios from "axios";
import LoadingComponent from "@/components/loading";
import { BACKEND_URL } from "@/lib/constant";

interface SectionResult {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
}

interface QuestionAnalysisItem {
  questionText: string;
  options: string[];
  correctOption: number;
  selectedOption: number;
  isCorrect: boolean;
}

interface TestResultData {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  invalid: boolean;
  tabSwitches: number;
  autoSubmitted: boolean;
  sectionResults?: SectionResult[];
  questionAnalysis?: QuestionAnalysisItem[];
}

export default function TestResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<TestResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/test/${params.id}/result`,
          { withCredentials: true }
        );

        // Process the response to include section results
        const resultData = response.data.data;
        console.log(response.data.data);

        // Transform section data if available
        const sectionResults =
          resultData.sectionResults?.map((section: any) => ({
            name: section.sectionName,
            totalQuestions: section.totalQuestions,
            correctAnswers: section.correctAnswers,
            score: (section.correctAnswers / section.totalQuestions) * 100,
            timeSpent: section.timeSpent,
          })) || [];

        setResult({
          ...resultData,
          sectionResults,
          questionAnalysis: resultData.questionAnalysis || [],
        });
      } catch (error) {
        console.error("Failed to fetch test result:", error);
        setError("Failed to load test result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params.id]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">{error}</div>
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