"use client";

import { useState } from "react";
import { TestInterface } from "@/components/test/test-interface";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { TestResultDetails } from "@/components/test/test-result-details";
import { cetQuestions } from "@/lib/data/cet-demo-test";

export default function CetTestPage() {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeSpent, setTimeSpent] = useState(0);

  const sections = [
    {
      name: "Physics & Chemistry",
      duration: 90,
      questions: cetQuestions.slice(0, 50)
    },
    {
      name: "Mathematics",
      duration: 90,
      questions: cetQuestions.slice(50, 100)
    }
  ];

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
        questions={cetQuestions}
        userAnswers={userAnswers}
        timeSpent={timeSpent}
        onRetry={handleRetry}
      />
    );
  }

  if (testStarted) {
    return (
      <TestInterface
        testId="cet-demo"
        testName="CET Mock Test"
        sections={sections}
        onComplete={handleTestComplete}
      />
    );
  }

  return (
    <TestInfoDisplay
      title="CET Mock Test"
      description="Complete mock test simulating the actual CET exam environment"
      duration={180}
      questionCount={100}
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