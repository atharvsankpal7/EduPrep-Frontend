"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Question, TestInterface } from "@/components/test/test-interface";
import { Clock, BookOpen, AlertTriangle } from "lucide-react";
const demoQuestions: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which programming language is React built with?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Mars", "Saturn", "Jupiter", "Neptune"],
    correctAnswer: 2,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Silver", "Oxygen", "Iron"],
    correctAnswer: 2,
  },
  {
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    question: "What is the largest mammal on Earth?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctAnswer: 1,
  },
  {
    question: "What is the main component of the Sun?",
    options: ["Helium", "Oxygen", "Hydrogen", "Nitrogen"],
    correctAnswer: 2,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is the speed of light?",
    options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
    correctAnswer: 0,
  },
  {
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "India"],
    correctAnswer: 2,
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
  },
  {
    question: "Who is known as the father of modern physics?",
    options: [
      "Isaac Newton",
      "Albert Einstein",
      "Galileo Galilei",
      "Stephen Hawking",
    ],
    correctAnswer: 1,
  },
];
export default function GateTestPage() {
  const [testStarted, setTestStarted] = useState(false);

  if (testStarted) {
    return (
      <TestInterface
        testId="gate-123"
        testName="GATE Computer Science Mock Test"
        duration={180}
        totalQuestions={65}
        questions={demoQuestions}
        onComplete={  (answers) => {
          console.log("Test completed with answers:", answers);
        }}
      />
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">GATE Mock Test</h1>
          <p className="text-muted-foreground">
            Complete mock test simulating the actual GATE exam environment
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Duration
              </CardTitle>
              <CardDescription>3 hours</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Questions
              </CardTitle>
              <CardDescription>65 questions</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Important
              </CardTitle>
              <CardDescription>Full screen mode required</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Before you begin:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Ensure you have a stable internet connection</li>
                <li>Find a quiet place without distractions</li>
                <li>Keep your webcam and microphone ready for proctoring</li>
                <li>The test will automatically submit when the time is up</li>
                <li>Switching tabs or windows will be recorded</li>
              </ul>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" className="w-full mt-4">
                    Start Test
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ready to begin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The test will start immediately in full-screen mode. Make
                      sure you&apos;re ready to spend the next 3 hours
                      uninterrupted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setTestStarted(true)}>
                      Start Now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
