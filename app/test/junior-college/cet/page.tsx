"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { createTest } from "@/lib/backendCalls/createTest";
import { EducationLevel } from "@/lib/type";
import { useToast } from "@/components/ui/use-toast";
import LoadingComponent from "@/components/loading";

export default function CetTestPage() {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const startTest = async () => {
    try {
      setLoading(true);
      const response = (await createTest({
        educationLevel: EducationLevel.JuniorCollege,
        isCet: true,
      })) as any;

      if (!response.data.testDetails.testId) {
        throw new Error("Failed to create test");
      }

      router.push(`/test/${response.data.testDetails.testId}`);
    } catch (error) {
      console.error("Error creating test:", error);
      setShowError(true);
      toast({
        title: "Error",
        description: "Failed to create test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <ErrorMessageDialog
        open={showError}
        onClose={() => setShowError(false)}
      />
      <TestInfoDisplay
        title="CET Mock Test"
        description="Complete mock test simulating the actual CET exam environment"
        duration={180}
        questionCount={100}
        onStart={startTest}
        requirements={[
          "Enough time for the test",
          "Stable internet connection",
        ]}
      />
    </>
  );
}
