"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, BarChart2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SectionResult {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
}

interface TestResultProps {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  tabSwitches: number;
  autoSubmitted: boolean;
  sectionResults?: SectionResult[];
}

export function TestResult({
  totalQuestions,
  correctAnswers,
  score,
  timeSpent,
  tabSwitches,
  autoSubmitted,
  sectionResults = [],
}: TestResultProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-4xl py-12"
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
          <Tabs defaultValue="overall" className="w-full">
            <TabsList className="grid w-full ">
              <TabsTrigger value="overall">Overall Results</TabsTrigger>
              {/* <TabsTrigger value="sections" disabled={sectionResults.length === 0}>
                Section-wise Results
              </TabsTrigger> */}
            </TabsList>
            
            <TabsContent value="overall" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
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

                <div className="flex flex-col items-center p-4 bg-blue-500/10 rounded-lg">
                  <Clock className="w-8 h-8 mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </div>
              </div>

              {tabSwitches > 0 && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-destructive text-sm">
                    Tab switches detected: {tabSwitches} time{tabSwitches !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sections">
              <div className="space-y-6">
                {sectionResults.map((section, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <CardTitle className="text-xl">{section.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg">
                          <BarChart2 className="w-6 h-6 mb-2 text-primary" />
                          <div className="text-xl font-bold">{section.score.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Section Score</div>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 bg-green-500/10 rounded-lg">
                          <CheckCircle2 className="w-6 h-6 mb-2 text-green-500" />
                          <div className="text-xl font-bold">{section.correctAnswers}</div>
                          <div className="text-xs text-muted-foreground">Correct</div>
                        </div>

                        <div className="flex flex-col items-center p-4 bg-red-500/10 rounded-lg">
                          <XCircle className="w-6 h-6 mb-2 text-red-500" />
                          <div className="text-xl font-bold">{section.totalQuestions - section.correctAnswers}</div>
                          <div className="text-xs text-muted-foreground">Incorrect</div>
                        </div>

                        <div className="flex flex-col items-center p-4 bg-blue-500/10 rounded-lg">
                          <Clock className="w-6 h-6 mb-2 text-blue-500" />
                          <div className="text-xl font-bold">{Math.floor(section.timeSpent / 60)}m {section.timeSpent % 60}s</div>
                          <div className="text-xs text-muted-foreground">Time</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

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