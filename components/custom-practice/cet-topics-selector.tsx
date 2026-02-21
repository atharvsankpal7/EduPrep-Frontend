"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Dices, Search, BookOpen, Calculator, Atom } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CetSubjectTopics } from "@/lib/api/hooks/useCetTopics";
import { TopicList } from "@/lib/type";

interface CetTopicsSelectorProps {
  cetTopics: CetSubjectTopics[];
  onStartTest: (topics: TopicList) => void;
  onBack: () => void;
}

export function CetTopicsSelector({
  cetTopics,
  onStartTest,
  onBack,
}: CetTopicsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const subjectIcons = {
    "Physics": <Atom className="h-5 w-5" />,
    "Chemistry": <BookOpen className="h-5 w-5" />,
    "Mathematics": <Calculator className="h-5 w-5" />
  };

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return cetTopics;
    }

    const query = searchQuery.toLowerCase();
    return cetTopics.map(subjectGroup => ({
      ...subjectGroup,
      topics: subjectGroup.topics.filter(topic =>
        topic.topicName.toLowerCase().includes(query)
      )
    })).filter(subjectGroup => subjectGroup.topics.length > 0);
  }, [cetTopics, searchQuery]);

  const standardFilteredTopics = useMemo(() => {
    if (activeTab === "all") {
      return filteredTopics;
    }
    return filteredTopics.filter(subjectGroup =>
      subjectGroup.standard === parseInt(activeTab)
    );
  }, [filteredTopics, activeTab]);

  const handleTopicToggle = (subject: string, topicId: string, topicName: string) => {
    setSelectedTopics(prev => {
      const currentTopics = prev[subject] || [];
      const topicKey = `${topicId}:${topicName}`;

      const updatedTopics = currentTopics.includes(topicKey)
        ? currentTopics.filter(t => t !== topicKey)
        : [...currentTopics, topicKey];

      return { ...prev, [subject]: updatedTopics };
    });
  };

  const handleSelectAllInSubject = (subject: string, topics: { topicId: string, topicName: string }[]) => {
    setSelectedTopics(prev => {
      const currentTopics = prev[subject] || [];
      const allTopicKeys = topics.map(t => `${t.topicId}:${t.topicName}`);

      // If all topics are already selected, deselect all
      if (allTopicKeys.every(key => currentTopics.includes(key))) {
        return { ...prev, [subject]: [] };
      }

      // Otherwise, select all
      return { ...prev, [subject]: allTopicKeys };
    });
  };

  const toggleExpandSubject = (subject: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleStartTest = () => {
    const topicList: TopicList = {
      subjects: Object.entries(selectedTopics)
        .filter(([_, topics]) => topics.length > 0)
        .map(([subjectName, topicKeys]) => {
          const [subject, standard] = subjectName.split('-');
          return {
            subjectName: subject,
            topics: topicKeys.map(key => {
              const [_, name] = key.split(':');
              return name;
            }),
            topicIds: topicKeys.map(key => {
              const [id] = key.split(':');
              return id;
            })
          };
        }),
    };

    onStartTest(topicList);
  };

  const totalSelectedTopics = Object.values(selectedTopics).flat().length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 self-start">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>

        <div className="flex flex-1 md:max-w-md relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={handleStartTest}
          className="gap-2"
          disabled={totalSelectedTopics === 0}
        >
          <Dices className="w-4 h-4" />
          Create Test
          {totalSelectedTopics > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalSelectedTopics}
            </Badge>
          )}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Standards</TabsTrigger>
          <TabsTrigger value="11">11th Standard</TabsTrigger>
          <TabsTrigger value="12">12th Standard</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {standardFilteredTopics.map((subjectGroup) => (
              <motion.div key={`${subjectGroup.subject}-${subjectGroup.standard}`} variants={item}>
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {subjectIcons[subjectGroup.subject as keyof typeof subjectIcons] || <BookOpen className="h-5 w-5" />}
                        <CardTitle className="text-xl">
                          {subjectGroup.subject}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {subjectGroup.standard}th Standard
                          </Badge>
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectAllInSubject(
                          `${subjectGroup.subject}-${subjectGroup.standard}`,
                          subjectGroup.topics
                        )}
                      >
                        {selectedTopics[`${subjectGroup.subject}-${subjectGroup.standard}`]?.length === subjectGroup.topics.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subjectGroup.topics.map((topic) => (
                        <div
                          key={topic.topicId}
                          className={`flex items-center gap-2 p-3 rounded-md transition-colors ${selectedTopics[`${subjectGroup.subject}-${subjectGroup.standard}`]?.includes(`${topic.topicId}:${topic.topicName}`)
                              ? 'bg-primary/10 border border-primary/20'
                              : 'hover:bg-muted border border-transparent'
                            }`}
                        >
                          <Checkbox
                            id={topic.topicId}
                            checked={selectedTopics[`${subjectGroup.subject}-${subjectGroup.standard}`]?.includes(`${topic.topicId}:${topic.topicName}`) || false}
                            onCheckedChange={() => handleTopicToggle(
                              `${subjectGroup.subject}-${subjectGroup.standard}`,
                              topic.topicId,
                              topic.topicName
                            )}
                          />
                          <label
                            htmlFor={topic.topicId}
                            className="flex-1 text-sm font-medium capitalize cursor-pointer"
                          >
                            {topic.topicName}
                            <Badge variant="secondary" className="ml-2">
                              {topic.questionCount} Q
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {standardFilteredTopics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No topics found matching your search.</p>
        </div>
      )}
    </div>
  );
}