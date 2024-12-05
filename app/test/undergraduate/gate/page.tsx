"use client";

import { useState } from "react";
import { TestInterface } from "@/components/test/test-interface";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { createTest } from "@/lib/backendCalls/createTest";
import { EducationLevel } from "@/lib/type";
import { useRouter } from "next/navigation";

const demoQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  // ... rest of the demo questions
];

export default function GateTestPage() {
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const startNewTest = async () => {
    try {
      const response = await createTest({
        educationLevel: EducationLevel.Undergraduate,
      });
      if (!response.testId) {
        throw new Error("Failed to create test");
      }
      router.push(`/test/${response.testId}`);
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <>
      <ErrorMessageDialog open={showError} onClose={() => setShowError(false)} />
      <TestInfoDisplay
        title="GATE Mock Test"
        description="Complete mock test simulating the actual GATE exam environment"
        duration={180}
        questionCount={65}
        onStart={startNewTest}
        requirements={[
          "Valid ID proof",
          "Working webcam and microphone",
          "Stable internet connection",
          "Quiet environment",
        ]}
      />
    </>
  );
}