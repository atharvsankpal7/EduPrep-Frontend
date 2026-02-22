"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { useCreateTest } from "@/lib/api/hooks/useCreateTest";
import { EducationLevel } from "@/types/global/interface/test.apiInterface";
import { useToast } from "@/components/ui/use-toast";
import LoadingComponent from "@/components/loading";

export default function CetTestPage() {
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const createTestMutation = useCreateTest();

  const startTest = () => {
    createTestMutation.mutate(
      {
        educationLevel: EducationLevel.JuniorCollege,
        isCet: true,
      },
      {
        onSuccess: (response: any) => {
          const testId = response?.data?.testDetails?.testId;
          if (!testId) {
            setShowError(true);
            return;
          }
          router.push(`/test/${testId}`);
        },
        onError: () => {
          setShowError(true);
          toast({
            title: "Error",
            description: "Failed to create test. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (createTestMutation.isPending) {
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
