"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Dices } from "lucide-react";
import { juniorCollegeSubjects } from "@/lib/data/junior-college-subjects";

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

export function JuniorCollegeSection() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const router = useRouter();

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSelectAll = () => {
    const allTopics = Object.values(juniorCollegeSubjects.science.categories).flatMap((category) =>
      category.topics.map((topic) => topic)
    );
    setSelectedTopics(allTopics);
  };

  const startRandomTest = () => {
    if (selectedTopics.length > 0) {
      router.push(
        `/test/junior-college/random?subjects=${encodeURIComponent(
          selectedTopics.join(",")
        )}`
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleSelectAll}>
          Select All
        </Button>
        <Button
          onClick={startRandomTest}
          className="gap-2"
          disabled={selectedTopics.length === 0}
        >
          <Dices className="w-4 h-4" /> Start Random Test
        </Button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        {Object.entries(juniorCollegeSubjects.science.categories).map(
          ([categoryKey, category]) => (
            <motion.div key={categoryKey} variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value={categoryKey}>
                      <AccordionTrigger>{category.name}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {category.topics.map((topic, index) => (
                            <div
                              key={`${categoryKey}-${index}`}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`${categoryKey}-${index}`}
                                checked={selectedTopics.includes(topic)}
                                onCheckedChange={() => handleTopicToggle(topic)}
                              />
                              <label
                                htmlFor={`${categoryKey}-${index}`}
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
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  );
}
