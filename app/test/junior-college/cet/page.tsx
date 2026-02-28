"use client";

import { TestInfoDisplay } from "@/components/test-engine/pre-test/test-info-display";
import { ErrorMessageDialog } from "@/components/test-engine/pre-test/error-message-dialog";
import { EducationLevel } from "@/types/global/interface/test.apiInterface";
import { useCreateAndNavigate } from "../use-create-and-navigate";

export default function CetTestPage() {
  const { createAndNavigate, isPending, hasError, clearError } =
    useCreateAndNavigate();

  const startTest = () => {
    createAndNavigate({
      educationLevel: EducationLevel.JuniorCollege,
      isCet: true,
    });
  };

  return (
    <>
      <ErrorMessageDialog open={hasError} onClose={clearError} />
      <TestInfoDisplay
        title="CET Mock Test"
        description="Complete mock test simulating the actual CET exam environment"
        duration={180}
        questionCount={100}
        onStart={startTest}
        startButtonLabel={isPending ? "Starting Test..." : "Start Test"}
        isStartDisabled={isPending}
        isStartLoading={isPending}
        requirements={[
          "Enough time for the test",
          "Stable internet connection",
        ]}
      />
    </>
  );
}
