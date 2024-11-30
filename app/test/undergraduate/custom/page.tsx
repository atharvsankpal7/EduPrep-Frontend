"use client";

import { CustomizedTest } from "@/components/custom-practice/customized-test";

export default function CustomTestPage() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Custom Practice Test</h1>
          <p className="text-muted-foreground">
            Create your own test by selecting specific topics and subjects
          </p>
        </div>
        
        <CustomizedTest onBack={() => window.history.back()} />
      </div>
    </div>
  );
}