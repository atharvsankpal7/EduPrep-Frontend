"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, BarChart2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Question } from "./test-interface";
import Image from "next/image";

interface TestResultDetailsProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  timeSpent: number;
  onRetry?: () => void;
}

export function TestResultDetails({
  questions,
  userAnswers,
  timeSpent,
  onRetry
}: TestResultDetailsProps) {
  const router = useRouter();
  
  // Calculate results
  const totalQuestions = questions.length;
  const correctAnswers = questions.reduce((count, question, index) => {
    return count + (userAnswers[index] === question.correctAnswer ? 1 : 0);
  }, 0);
  const score = (correctAnswers / totalQuestions) * 100;

  // Function to check if a string is a valid image URL
  const isImageUrl = (str: string) => {
    return str.match(/\.(jpeg|jpg|gif|png)$/) !== null || str.startsWith('http') && (str.includes('/images/') || str.includes('/img/'));
  };

  // Function to render text or image based on content
  const renderContent = (content: string) => {
    if (isImageUrl(content)) {
      return (
        <div className="flex justify-center my-2">
          <Image 
            src={content} 
            alt="Question content" 
            width={500} 
            height={300} 
            className="max-w-full object-contain rounded-md"
            unoptimized // For external images
          />
        </div>
      );
    }
    return <span>{content}</span>;
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <BarChart2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Test Results</h1>
          <p className="text-muted-foreground">
            Here&apos;s how you performed in your GATE mock test
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="w-5 h-5 text-primary" />
                Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{score.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Correct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{correctAnswers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <XCircle className="w-5 h-5 text-red-500" />
                Incorrect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalQuestions - correctAnswers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Time Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.floor(timeSpent / 60)}m</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  userAnswers[index] === question.correctAnswer
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                }`}
              >
                <div className="flex items-start gap-2">
                  {userAnswers[index] === question.correctAnswer ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">
                      Question {index + 1}: {renderContent(question.question)}
                    </p>
                    <div className="grid gap-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded ${
                            optIndex === question.correctAnswer
                              ? "bg-green-500/20"
                              : optIndex === userAnswers[index]
                              ? "bg-red-500/20"
                              : "bg-muted"
                          }`}
                        >
                          {renderContent(option)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
          <Button onClick={() => router.push("/test")}>Back to Tests</Button>
        </div>
      </div>
    </div>
  );
}