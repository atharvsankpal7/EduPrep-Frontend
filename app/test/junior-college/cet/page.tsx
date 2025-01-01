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

export default function CetTestPage() {
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const startNewTest = async () => {
    try {
      const response = await createTest({
        educationLevel: EducationLevel.JuniorCollege,
        isCet: true,
      });
     
      if (!response.data.testDetails.testId) {
        throw new Error("Failed to create test");
      }
      router.push(`/test/${response.data.testDetails.testId}`);
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <>
      <ErrorMessageDialog open={showError} onClose={() => setShowError(false)} />
      <TestInfoDisplay
        title="CET Mock Test"
        description="Comprehensive mock test following the CET examination pattern"
        duration={120}
        questionCount={50}
        onStart={startNewTest}
        requirements={[
          "Valid hall ticket",
          "Working webcam and microphone",
          "Stable internet connection",
          "Quiet environment",
        ]}
      />
    </>
  );
}