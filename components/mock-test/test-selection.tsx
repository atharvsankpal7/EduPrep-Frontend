"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Brain, Calculator, Settings } from "lucide-react";
import Link from "next/link";

const availableTests = [
  {
    id: "math-101",
    title: "Mathematics Basic",
    description: "Fundamental mathematics concepts including algebra and geometry",
    duration: "60 minutes",
    questions: 30,
    icon: Calculator,
  },
  {
    id: "science-101",
    title: "General Science",
    description: "Basic concepts in physics, chemistry, and biology",
    duration: "45 minutes",
    questions: 25,
    icon: Brain,
  },
  {
    id: "english-101",
    title: "English Comprehension",
    description: "Reading comprehension and grammar assessment",
    duration: "40 minutes",
    questions: 20,
    icon: BookOpen,
  },
];

interface TestSelectionProps {
  onTestStart: (testId: string) => void;
}

export function TestSelection({ onTestStart }: TestSelectionProps) {
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Available Mock Tests</h1>
          <p className="text-muted-foreground">
            Select a test to begin your practice session
          </p>
        </div>

        {/* Custom Practice Test Button */}
        <div className="mb-8">
          <Link href="/custom-practice">
            <Button size="lg" className="w-full sm:w-auto" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Create Custom Practice Test
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <test.icon className="w-8 h-8 text-primary" />
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{test.duration}</span>
                  </div>
                </div>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {test.questions} questions
                  </span>
                  <Button onClick={() => onTestStart(test.id)}>
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}