"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Database, Calculator, Cpu, BarChart, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

const subjects = {
  database: {
    icon: Database,
    chapters: [
      "SQL Fundamentals",
      "Database Design",
      "Normalization",
      "Transactions & Concurrency",
      "Indexing & Optimization",
      "NoSQL Concepts",
    ],
  },
  quantitative: {
    icon: Calculator,
    chapters: [
      "Profit and Loss",
      "Percentage",
      "Time and Work",
      "Simple Interest",
      "Compound Interest",
      "Ratio and Proportion",
      "Average",
      "Partnership",
    ],
  },
  operatingSystem: {
    icon: Cpu,
    chapters: [
      "Process Management",
      "Memory Management",
      "File Systems",
      "CPU Scheduling",
      "Deadlocks",
      "Virtual Memory",
    ],
  },
  dataInterpretation: {
    icon: BarChart,
    chapters: [
      "Tables",
      "Graphs",
      "Pie Charts",
      "Line Charts",
      "Bar Graphs",
      "Caselets",
    ],
  },
  reasoning: {
    icon: BookOpen,
    chapters: [
      "Verbal Ability",
      "Reading Comprehension",
      "Grammar",
      "Parts of Speech",
      "Vocabulary",
      "Sentence Correction",
    ],
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CustomPracticePage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  const handleChapterToggle = (chapter: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapter)
        ? prev.filter((c) => c !== chapter)
        : [...prev, chapter]
    );
  };

  const startCustomTest = () => {
    if (selectedChapters.length > 0) {
      // In a real application, you would pass these parameters to generate a custom test
      router.push(`/mock-test?type=custom&chapters=${selectedChapters.join(",")}`);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Custom Practice Test</h1>
          <p className="text-muted-foreground">
            Select subjects and topics to create your personalized practice test
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          {Object.entries(subjects).map(([key, { icon: Icon, chapters }]) => (
            <motion.div key={key} variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </CardTitle>
                    <Badge variant="secondary">
                      {chapters.length} chapters
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value={key}>
                      <AccordionTrigger>View Chapters</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {chapters.map((chapter) => (
                            <div
                              key={chapter}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                id={chapter}
                                checked={selectedChapters.includes(chapter)}
                                onChange={() => handleChapterToggle(chapter)}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <label
                                htmlFor={chapter}
                                className="text-sm cursor-pointer"
                              >
                                {chapter}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            onClick={startCustomTest}
            disabled={selectedChapters.length === 0}
          >
            Start Custom Test
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}