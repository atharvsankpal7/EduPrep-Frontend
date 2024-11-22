"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, LineChart, PieChart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceChart } from "@/components/analytics/performance-chart";
import { SubjectDistribution } from "@/components/analytics/subject-distribution";
import { TimeSpentAnalysis } from "@/components/analytics/time-spent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your performance and progress over time
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-4 sm:gap-6 mb-8 grid-cols-2 md:grid-cols-4">
            <StatsCard
              title="Average Score"
              value="78%"
              description="Last 30 days"
              icon={BarChart2}
              trend="up"
              trendValue="12%"
            />
            <StatsCard
              title="Tests Completed"
              value="24"
              description="Last 30 days"
              icon={LineChart}
              trend="up"
              trendValue="8"
            />
            <StatsCard
              title="Study Time"
              value="45h"
              description="Last 30 days"
              icon={Calendar}
              trend="down"
              trendValue="5h"
            />
            <StatsCard
              title="Accuracy Rate"
              value="82%"
              description="Last 30 days"
              icon={PieChart}
              trend="up"
              trendValue="4%"
            />
          </div>

          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="time">Time Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <PerformanceChart timeRange={timeRange} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <SubjectDistribution />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="time" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time Spent Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <TimeSpentAnalysis timeRange={timeRange} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: "up" | "down";
  trendValue: string;
}

function StatsCard({ title, value, description, icon: Icon, trend, trendValue }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`text-xs ${trend === "up" ? "text-green-500" : "text-red-500"} mt-1`}>
          {trend === "up" ? "↑" : "↓"} {trendValue}
        </div>
      </CardContent>
    </Card>
  );
}