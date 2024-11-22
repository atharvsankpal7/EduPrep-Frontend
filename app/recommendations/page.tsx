"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Star, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recommendedTopics = [
  {
    id: 1,
    title: "Advanced Algebra",
    description: "Master quadratic equations and polynomials",
    difficulty: "Intermediate",
    category: "Mathematics",
    progress: 65,
  },
  {
    id: 2,
    title: "Chemical Bonding",
    description: "Understanding molecular structures and bonds",
    difficulty: "Advanced",
    category: "Chemistry",
    progress: 40,
  },
  {
    id: 3,
    title: "Grammar Essentials",
    description: "Perfect your understanding of English grammar",
    difficulty: "Beginner",
    category: "English",
    progress: 80,
  },
];

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

export default function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = recommendedTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Personalized Recommendations</h1>
          <p className="text-muted-foreground">
            Topics and practice tests tailored to your learning journey
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Sort by Progress
          </Button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {filteredTopics.map((topic) => (
            <motion.div key={topic.id} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-primary" />
                        {topic.title}
                      </CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </div>
                    <Badge variant={
                      topic.difficulty === "Beginner" ? "secondary" :
                      topic.difficulty === "Intermediate" ? "default" : "destructive"
                    }>
                      {topic.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        Recommended based on your performance
                      </span>
                    </div>
                    <Button>Start Learning</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No topics found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}