"use client";

import { TestInfoDisplay } from "@/components/test-engine/pre-test/test-info-display";
import { ErrorMessageDialog } from "@/components/test-engine/pre-test/error-message-dialog";
import { EducationLevel } from "@/types/global/interface/test.apiInterface";
import LoadingComponent from "@/components/loading";
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

  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <>
      <ErrorMessageDialog open={hasError} onClose={clearError} />
      <TestInfoDisplay
        title="CET Mock Test"
        description="Complete mock test simulating the actual CET exam environment"
        duration={180}
        questionCount={100}
        onStart={startTest}
        startButtonLabel={isPending ? "Creating Test..." : "Start Test"}
        isStartDisabled={isPending}
        requirements={[
          "Enough time for the test",
          "Stable internet connection",
        ]}
      />
    </>
  );
}
