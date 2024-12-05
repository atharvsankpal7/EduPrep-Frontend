import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

const InvalidResult = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="p-4 rounded-full bg-red-100 mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Results Unavailable</h2>
        <p className="text-muted-foreground text-center mb-6">
          We couldn&apos;t find the test results you&apos;re looking for.
        </p>
        <Button onClick={onClick} className="gap-2">
          Return to Tests <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default InvalidResult;
