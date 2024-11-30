"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Dices } from "lucide-react";
import { undergraduateSubjects } from "@/lib/data/undergraduate-subjects";
import { createTest } from "@/lib/backendCalls/createTest";
import { EducationLevel, TopicList } from "@/lib/type";

export function CustomizedTest({ onBack }: { onBack: () => void }) {
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>({});
  const router = useRouter();

  // Toggle a topic under a specific subject
  const handleTopicToggle = (subject: string, topic: string) => {
    setSelectedTopics((prev) => {
      const currentTopics = prev[subject] || [];
      const updatedTopics = currentTopics.includes(topic)
        ? currentTopics.filter((t) => t !== topic)
        : [...currentTopics, topic];
      return { ...prev, [subject]: updatedTopics };
    });
  };

  // Select all topics across all subjects
  const handleSelectAll = () => {
    const allTopics: Record<string, string[]> = {};
    Object.entries(undergraduateSubjects).forEach(([subjectKey, section]) => {
      allTopics[subjectKey] = Object.values(section.categories).flatMap((category) => category.topics);
    });
    setSelectedTopics(allTopics);
  };

  // Start random test with selected topics
  const startRandomTest = async () => {
    const topicList: TopicList = {
      subjects: Object.entries(selectedTopics).map(([subjectName, topics]) => ({
        subjectName,
        topics,
      })),
    };

    try {
      const response = await createTest({
        educationLevel: EducationLevel.Undergraduate,
        topicList,
      });
      router.push(`/test/${response.testId}`);
    } catch (error) {
      console.error("Failed to create test:", error);
      alert("Error creating test. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button
            onClick={startRandomTest}
            className="gap-2"
            disabled={
              Object.values(selectedTopics).flatMap((topics) => topics).length === 0
            }
          >
            <Dices className="w-4 h-4" /> Start Random Test
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(undergraduateSubjects).map(([subjectKey, section]) => (
          <Card key={subjectKey}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {Object.entries(section.categories).map(([categoryKey, category]) => (
                  <AccordionItem value={categoryKey} key={categoryKey}>
                    <AccordionTrigger>{category.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2">
                        {category.topics.map((topic) => (
                          <div key={topic} className="flex items-center gap-2">
                            <Checkbox
                              id={topic}
                              checked={selectedTopics[subjectKey]?.includes(topic) || false}
                              onCheckedChange={() => handleTopicToggle(subjectKey, topic)}
                            />
                            <label
                              htmlFor={topic}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {topic}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
