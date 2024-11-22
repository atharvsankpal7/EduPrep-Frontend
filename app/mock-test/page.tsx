"use client";

import { useState } from "react";
import { TestInterface } from "@/components/mock-test/test-interface";
import { TestSelection } from "@/components/mock-test/test-selection";

export default function MockTestPage() {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  if (!testStarted) {
    return (
      <TestSelection
        onTestStart={(testId) => {
          setSelectedTest(testId);
          setTestStarted(true);
        }}
      />
    );
  }

  return <TestInterface testId={selectedTest!} onTestEnd={() => setTestStarted(false)} />;
}