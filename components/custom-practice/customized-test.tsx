"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Dices } from "lucide-react";

const subjects = {
  core: {
    title: "Core Subjects",
    categories: {
      database: {
        name: "Database Management",
        topics: ["SQL Fundamentals", "Normalization", "Transactions", "Indexing", "Query Optimization", "ACID Properties"],
      },
      os: {
        name: "Operating Systems",
        topics: ["Process Management", "Memory Management", "File Systems", "CPU Scheduling", "Deadlocks", "Virtual Memory"],
      },
      networks: {
        name: "Computer Networks",
        topics: ["OSI Model", "TCP/IP", "Routing", "Network Security", "Protocols", "Socket Programming"],
      },
      dataStructures: {
        name: "Data Structures",
        topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Sorting", "Searching", "Dynamic Programming"],
      },
    },
  },
  aptitude: {
    title: "Aptitude",
    categories: {
      arithmetic: {
        name: "Arithmetic Aptitude",
        topics: ["Problems on Trains", "Time and Distance", "Simple Interest", "Compound Interest", "Profit and Loss", "Percentage"],
      },
      dataInterpretation: {
        name: "Data Interpretation",
        topics: ["Table Charts", "Bar Charts", "Pie Charts", "Line Charts"],
      },
    },
  },
  verbal: {
    title: "Verbal and Reasoning",
    categories: {
      verbalAbility: {
        name: "Verbal Ability",
        topics: ["Spotting Errors", "Synonyms", "Antonyms", "Sentence Formation", "Comprehension"],
      },
      logicalReasoning: {
        name: "Logical Reasoning",
        topics: ["Number Series", "Analogies", "Logical Problems", "Statement and Assumption"],
      },
      visualReasoning: {
        name: "Visual Reasoning",
        topics: ["Pattern Recognition", "Mirror Images", "Paper Folding", "Figure Matrix"],
      },
    },
  },
};

interface CustomizedTestProps {
  onBack: () => void;
}

export function CustomizedTest({ onBack }: CustomizedTestProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSelectAll = () => {
    const allTopics = Object.values(subjects).flatMap(section =>
      Object.values(section.categories).flatMap(category => category.topics)
    );
    setSelectedTopics(allTopics);
  };

  const startRandomTest = () => {
    // Implement random test generation logic
    console.log("Starting random test with selected topics:", selectedTopics);
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
          <Button onClick={startRandomTest} className="gap-2">
            <Dices className="w-4 h-4" /> Start Random Test
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(subjects).map(([sectionKey, section]) => (
          <Card key={sectionKey}>
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
                              checked={selectedTopics.includes(topic)}
                              onCheckedChange={() => handleTopicToggle(topic)}
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