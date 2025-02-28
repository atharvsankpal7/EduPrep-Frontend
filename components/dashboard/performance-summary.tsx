"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopicPerformance {
  topic: string;
  correctPercentage: number;
  totalQuestions: number;
}

interface PerformanceSummaryProps {
  averageScore: number;
  totalTests: number;
  lastTestDate: string;
  topicPerformance: TopicPerformance[];
  recommendations: { topic: string; message: string }[];
}

export function PerformanceSummary({
  averageScore,
  totalTests,
  lastTestDate,
  topicPerformance,
  recommendations
}: PerformanceSummaryProps) {
  const [timeRange, setTimeRange] = useState("all");
  const router = useRouter();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Summary</h2>
        <Button variant="outline" onClick={() => router.push('/test-history')}>
          View Full History
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Across {totalTests} tests
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tests Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTests}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Last test: {lastTestDate}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Performing Topic</CardTitle>
            </CardHeader>
            <CardContent>
              {topicPerformance.length > 0 ? (
                <>
                  <div className="text-xl font-medium truncate">
                    {topicPerformance.sort((a, b) => b.correctPercentage - a.correctPercentage)[0]?.topic || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">
                      {topicPerformance.sort((a, b) => b.correctPercentage - a.correctPercentage)[0]?.correctPercentage.toFixed(1)}% correct
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>
              Your performance across different topics
            </CardDescription>
            <Tabs defaultValue="all" className="mt-2" onValueChange={setTimeRange}>
              <TabsList>
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="month">Last Month</TabsTrigger>
                <TabsTrigger value="week">Last Week</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {topicPerformance.length === 0 ? (
              <div className="text-center py-6">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">
                  Take more tests to see your topic performance
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {topicPerformance
                  .sort((a, b) => b.correctPercentage - a.correctPercentage)
                  .map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {topic.correctPercentage >= 70 ? (
                            <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                          ) : topic.correctPercentage >= 40 ? (
                            <BarChart className="mr-2 h-4 w-4 text-yellow-500" />
                          ) : (
                            <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{topic.topic}</span>
                        </div>
                        <Badge variant={topic.correctPercentage >= 70 ? "default" : topic.correctPercentage >= 40 ? "secondary" : "destructive"}>
                          {topic.correctPercentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={topic.correctPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Based on {topic.totalQuestions} questions</span>
                        <span>
                          {Math.round(topic.correctPercentage * topic.totalQuestions / 100)} correct
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              Personalized suggestions to improve your performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">
                  Complete more tests to get personalized recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{rec.topic}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}