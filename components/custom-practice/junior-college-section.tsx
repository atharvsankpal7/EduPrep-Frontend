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
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function JuniorCollegeSection() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const router = useRouter();

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSelectAll = () => {
    const allTopicIds = Object.values(juniorCollegeSubjects).flatMap(subject =>
      Object.values(subject.years).flatMap(topics => 
        topics.map(topic => topic.id)
      )
    );
    setSelectedTopics(allTopicIds);
  };

  const startRandomTest = () => {
    if (selectedTopics.length > 0) {
      router.push(`/test/junior-college/random?subjects=${selectedTopics.join(',')}`);
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
        {Object.entries(juniorCollegeSubjects).map(([subjectKey, subject]) => (
          <motion.div key={subjectKey} variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {Object.entries(subject.years).map(([year, topics]) => (
                    <AccordionItem value={`${subjectKey}-${year}`} key={`${subjectKey}-${year}`}>
                      <AccordionTrigger>{year} Standard</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {topics.map((topic) => (
                            <div key={topic.id} className="flex items-center gap-2">
                              <Checkbox
                                id={topic.id}
                                checked={selectedTopics.includes(topic.id)}
                                onCheckedChange={() => handleTopicToggle(topic.id)}
                              />
                              <label
                                htmlFor={topic.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {topic.name}
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}