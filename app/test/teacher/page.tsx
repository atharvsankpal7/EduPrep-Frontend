"use client";

import { TestSettings } from "@/components/test/teacher/test-settings";
import { undergraduateSubjects } from "@/lib/data/undergraduate-subjects";

export default function TeacherDashboardPage() {
  // Flatten all topics from undergraduate subjects
  const availableTopics = Object.values(undergraduateSubjects)
    .flatMap(section => 
      Object.values(section.categories)
        .flatMap(category => category.topics)
    );

  const handleSaveTest = (settings: any) => {
    // Here you would typically save the test settings to your backend
    console.log("Test settings saved:", settings);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
        <TestSettings 
          availableTopics={availableTopics}
          onSave={handleSaveTest}
        />
      </div>
    </div>
  );
}