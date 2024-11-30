"use client";

import { JuniorCollegeSection } from "@/components/custom-practice/junior-college-section";

export default function JuniorCollegePage() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Junior College Test Preparation</h1>
          <p className="text-muted-foreground">
            Select subjects and topics to create your personalized practice test
          </p>
        </div>

        <JuniorCollegeSection />
      </div>
    </div>
  );
}