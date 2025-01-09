"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, BarChart2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface TestResultProps {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  tabSwitches: number;
  autoSubmitted: boolean;
}

export function TestResult({
  totalQuestions,
  correctAnswers,
  score,
  timeSpent,
  tabSwitches,
  autoSubmitted,
}: TestResultProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-2xl py-12"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Test Results</CardTitle>
          {autoSubmitted && (
            <p className="text-destructive mt-2">
              Test was automatically submitted due to multiple tab switches.
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg">
              <BarChart2 className="w-8 h-8 mb-2 text-primary" />
              <div className="text-2xl font-bold">{score.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
              <div className="text-2xl font-bold">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-red-500/10 rounded-lg">
              <XCircle className="w-8 h-8 mb-2 text-red-500" />
              <div className="text-2xl font-bold">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect Answers</div>
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-blue-500/10 rounded-lg">
            <Clock className="w-8 h-8 mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
            <div className="text-sm text-muted-foreground">Time Spent</div>
          </div>

          {tabSwitches > 0 && (
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-destructive text-sm">
                Tab switches detected: {tabSwitches} time{tabSwitches !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push('/test')}>
              Take Another Test
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}