"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Dices } from "lucide-react";
import { createTest } from "@/lib/backendCalls/createTest";
import { EducationLevel, TCustomizedTestProps, TopicList } from "@/lib/type";



export function CustomizedTest({ onBack, subjects }: TCustomizedTestProps) {
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
    subjects.forEach((domain) => {
      domain.subjects.forEach((subject) => {
        allTopics[subject.subjectName] = subject.topics;
      });
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
        {subjects.map((domains) => (
          <Card key={domains.domain}>
            <CardHeader>
              <CardTitle>{`${domains.domain}`}</CardTitle>
            </CardHeader>
            <CardContent>
              {domains.subjects.map((subject) => (
                <Accordion key={subject.subjectName} type="multiple" className="w-full">
                  <AccordionItem value={subject.subjectName}>
                    <AccordionTrigger>{subject.subjectName}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2">
                        {subject.topics.map((topic) => (
                          <div key={topic} className="flex items-center gap-2">
                            <Checkbox
                              id={topic}
                              checked={selectedTopics[subject.subjectName]?.includes(topic) || false}
                              onCheckedChange={() => handleTopicToggle(subject.subjectName, topic)}
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
                </Accordion>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
