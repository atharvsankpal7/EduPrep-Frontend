"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Dices } from "lucide-react";
import { TCustomizedTestProps, TopicList } from "@/lib/type";

export function CustomizedTest({
  onBack,
  subjects,
  onStartTest,
}: TCustomizedTestProps & { onStartTest: (topics: TopicList) => void }) {
  const [selectedTopics, setSelectedTopics] = useState<
    Record<string, Set<string>>
  >({});

  const handleTopicToggle = (subject: string, topic: string) => {
    setSelectedTopics((prev) => {
      const currentTopics = prev[subject] || new Set();
      const updatedTopics = new Set(currentTopics);
      if (updatedTopics.has(topic)) {
        updatedTopics.delete(topic);
      } else {
        updatedTopics.add(topic);
      }
      return { ...prev, [subject]: updatedTopics };
    });
  };

  const handleSelectAll = () => {
    const allTopics: Record<string, Set<string>> = {};
    subjects.forEach((domain) => {
      domain.subjects.forEach((subject) => {
        allTopics[subject.subjectName] = new Set(subject.topics);
      });
    });
    setSelectedTopics(allTopics);
  };

  const handleStartTest = () => {
    const topicList: TopicList = {
      subjects: Object.entries(selectedTopics).map(([subjectName, topics]) => ({
        subjectName,
        topics: Array.from(topics),
      })),
    };
    onStartTest(topicList);
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
            onClick={handleStartTest}
            className="gap-2"
            disabled={
              !Object.values(selectedTopics).some((topics) => topics.size > 0)
            }
          >
            <Dices className="w-4 h-4" /> Create Test
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
                <Accordion
                  key={subject.subjectName}
                  type="multiple"
                  className="w-full"
                >
                  <AccordionItem value={subject.subjectName}>
                    <AccordionTrigger>{subject.subjectName}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2">
                        {subject.topics.map((topic) => (
                          <div key={topic} className="flex items-center gap-2">
                            <Checkbox
                              id={topic}
                              checked={
                                selectedTopics[subject.subjectName]?.has(topic) ||
                                false
                              }
                              onCheckedChange={() =>
                                handleTopicToggle(subject.subjectName, topic)
                              }
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