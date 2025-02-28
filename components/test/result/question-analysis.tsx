"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuestionAnalysisItem {
  questionText: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

interface QuestionAnalysisProps {
  questionAnalysis: QuestionAnalysisItem[];
}

export default function QuestionAnalysis({ questionAnalysis }: QuestionAnalysisProps) {
  // Animation variants
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Badge variant="outline" className="px-4 py-2">
              Total Questions: {questionAnalysis.length}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Correct Answers: {questionAnalysis.filter(q => q.isCorrect).length}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Incorrect Answers: {questionAnalysis.filter(q => !q.isCorrect).length}
            </Badge>
          </div>

          <div className="space-y-6">
            {questionAnalysis.map((question, index) => (
              <motion.div
                key={index}
                variants={item}
                className={`p-4 rounded-lg border ${
                  question.isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {question.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-medium text-lg mb-2">
                        Question {index + 1}: {question.questionText}
                      </h3>
                    </div>
                    <div className="grid gap-2">
                        
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded ${
                            optIndex === question.correctAnswer
                              ? "bg-green-500/20 border border-green-500/30"
                              : optIndex === question.selectedAnswer && !question.isCorrect
                              ? "bg-red-500/20 border border-red-500/30"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full border mr-2 text-sm">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span>{option}</span>
                            {optIndex === question.correctAnswer && (
                              <Badge className="ml-auto" variant="outline">Correct Answer</Badge>
                            )}
                            {optIndex === question.selectedAnswer && !question.isCorrect && (
                              <Badge className="ml-auto" variant="outline">Your Answer</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}