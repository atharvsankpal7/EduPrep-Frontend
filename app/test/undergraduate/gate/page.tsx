"use client";

import { TestInfoDisplay } from "@/components/test-engine/pre-test/test-info-display";
import { ErrorMessageDialog } from "@/components/test-engine/pre-test/error-message-dialog";
import { EducationLevel } from "@/types/global/interface/test.apiInterface";
import { useCreateAndNavigate } from "@/app/test/junior-college/use-create-and-navigate";

export default function GateTestPage() {
  const { createAndNavigate, isPending, hasError, clearError } =
    useCreateAndNavigate();

  const handleStart = () => {
    createAndNavigate({
      educationLevel: EducationLevel.Undergraduate,
    });
  };

  return (
    <>
      <ErrorMessageDialog open={hasError} onClose={clearError} />
      <TestInfoDisplay
        title="GATE Mock Test"
        description="Full-length GATE pattern simulation with section-wise timing and strict proctoring."
        duration={180}
        questionCount={65}
        onStart={handleStart}
        startButtonLabel={isPending ? "Starting Test..." : "Start Test"}
        isStartDisabled={isPending}
        isStartLoading={isPending}
        requirements={[
          "Stable internet connection",
          "Fullscreen capable browser",
          "Distraction-free environment",
          "Sufficient uninterrupted time",
        ]}
      />
    </>
  );
}
