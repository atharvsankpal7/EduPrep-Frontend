"use client";

import { useState } from "react";
import { TestInterface } from "@/components/test/test-interface";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { TestResultDetails } from "@/components/test/test-result-details";
import { gateQuestions } from "@/lib/data/gate-demo-test";

export default function GateTestPage() {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeSpent, setTimeSpent] = useState(0);

  const handleTestComplete = (answers: Record<number, number>, time: number) => {
    setUserAnswers(answers);
    setTimeSpent(time);
    setTestCompleted(true);
  };

  const handleRetry = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setUserAnswers({});
    setTimeSpent(0);
  };

  if (testCompleted) {
    return (
      <TestResultDetails
        questions={gateQuestions}
        userAnswers={userAnswers}
        timeSpent={timeSpent}
        onRetry={handleRetry}
      />
    );
  }

  if (testStarted) {
    return (
      <TestInterface
        testId="gate-demo"
        testName="GATE Mock Test"
        duration={180 * 60} // 3 hours in seconds
        totalQuestions={65}
        questions={gateQuestions}
        onComplete={handleTestComplete}
      />
    );
  }

  return (
    <TestInfoDisplay
      title="GATE Mock Test"
      description="Complete mock test simulating the actual GATE exam environment"
      duration={180}
      questionCount={65}
      onStart={() => setTestStarted(true)}
      requirements={[
        "Valid ID proof",
        "Working webcam and microphone",
        "Stable internet connection",
        "Quiet environment",
      ]}
    />
  );
}