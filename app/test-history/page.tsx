"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  BarChart2, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BACKEND_URL } from "@/lib/constant";
import { useAuthStore } from "@/lib/stores/auth-store";

// Types
interface TestResult {
  _id: string;
  testId: string;
  score: number;
  timeTaken: number;
  createdAt: string;
  testDetails: {
    testName: string;
    totalQuestions: number;
    totalDuration: number;
  };
  percentageScore: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface TopicRecommendation {
  topic: string;
  correctPercentage: number;
  message: string;
}

interface Analytics {
  totalTests: number;
  averageScore: number;
  topicRecommendations: TopicRecommendation[];
  recentTests: TestResult[];
}

interface TestDetailResult {
  testResult: {
    _id: string;
    testId: string;
    testName: string;
    score: number;
    totalQuestions: number;
    percentageScore: number;
    timeTaken: number;
    createdAt: string;
  };
  topicPerformance: {
    topic: string;
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
  }[];
  recommendations: {
    topic?: string;
    message: string;
  }[];
}

const TestHistoryPage = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, pages: 0 });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    
    fetchTestHistory(1);
    fetchAnalytics();
  }, [isAuthenticated, router]);

  const fetchTestHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/test-history?page=${page}&limit=10`, {
        withCredentials: true
      });
      
      setTestResults(response.data.data.testResults);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Failed to fetch test history:", error);
      toast({
        title: "Error",
        description: "Failed to load test history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/test-history/analytics`, {
        withCredentials: true
      });
      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchTestDetails = async (resultId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/test-history/${resultId}`, {
        withCredentials: true
      });
      setSelectedTest(response.data.data);
      setActiveTab("details");
    } catch (error) {
      console.error("Failed to fetch test details:", error);
      toast({
        title: "Error",
        description: "Failed to load test details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTestHistory(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter results by test name
    // This would typically be handled by the backend, but we'll do client-side filtering for now
    if (searchTerm.trim() === "") {
      fetchTestHistory(1);
    } else {
      const filtered = testResults.filter(result => 
        result.testDetails.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTestResults(filtered);
    }
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    let sorted = [...testResults];
    
    switch (value) {
      case "date":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "score-high":
        sorted.sort((a, b) => b.percentageScore - a.percentageScore);
        break;
      case "score-low":
        sorted.sort((a, b) => a.percentageScore - b.percentageScore);
        break;
      case "name":
        sorted.sort((a, b) => a.testDetails.testName.localeCompare(b.testDetails.testName));
        break;
    }
    
    setTestResults(sorted);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test History & Analytics</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="history">Test History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedTest}>Test Details</TabsTrigger>
          </TabsList>
          
          {/* Test History Tab */}
          <TabsContent value="history">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (Newest)</SelectItem>
                    <SelectItem value="score-high">Score (Highest)</SelectItem>
                    <SelectItem value="score-low">Score (Lowest)</SelectItem>
                    <SelectItem value="name">Test Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="w-full">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-10 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : testResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 rounded-full bg-muted mb-4">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Test History Found</h3>
                <p className="text-muted-foreground mb-6">You haven't taken any tests yet. Start a test to see your results here.</p>
                <Button onClick={() => router.push('/test')}>Take a Test</Button>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {testResults.map((result) => (
                  <motion.div key={result._id} variants={item}>
                    <Card className="w-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{result.testDetails.testName}</CardTitle>
                            <CardDescription>
                              {format(new Date(result.createdAt), "PPP 'at' p")}
                            </CardDescription>
                          </div>
                          <Badge className={getScoreBadge(result.percentageScore)}>
                            {Math.round(result.percentageScore)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>{result.score} / {result.testDetails.totalQuestions} correct</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>{formatDuration(result.timeTaken)}</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-auto"
                            onClick={() => fetchTestDetails(result._id)}
                          >
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {pagination.pages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                          className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show current page, first, last, and pages around current
                          return page === 1 || 
                                 page === pagination.pages || 
                                 Math.abs(page - pagination.page) <= 1;
                        })
                        .map((page, i, arr) => {
                          // Add ellipsis if there are gaps
                          if (i > 0 && page - arr[i - 1] > 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <PaginationItem>
                                  <span className="px-4 py-2">...</span>
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink
                                    isActive={page === pagination.page}
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </React.Fragment>
                            );
                          }
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === pagination.page}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                          className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </motion.div>
            )}
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {!analytics ? (
              <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Total Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analytics.totalTests}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tests completed
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Average Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-3xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                          {analytics.averageScore.toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Across all tests
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {analytics.recentTests.length > 0 
                            ? format(new Date(analytics.recentTests[0].createdAt), "MMM d")
                            : "No tests"}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Last test taken
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                
                {/* Recommendations */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Improvement Recommendations</CardTitle>
                      <CardDescription>
                        Based on your test performance, here are areas you should focus on
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics.topicRecommendations.length === 0 ? (
                        <p className="text-muted-foreground">
                          Take more tests to get personalized recommendations
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {analytics.topicRecommendations.map((rec, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {rec.correctPercentage < 50 ? (
                                    <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                                  ) : (
                                    <TrendingUp className="mr-2 h-4 w-4 text-yellow-500" />
                                  )}
                                  <span className="font-medium">{rec.topic}</span>
                                </div>
                                <span className={getScoreColor(rec.correctPercentage)}>
                                  {rec?.correctPercentage?.toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={rec.correctPercentage} className="h-2" />
                              <p className="text-sm text-muted-foreground">{rec.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* Recent Tests */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Tests</CardTitle>
                      <CardDescription>
                        Your most recent test performances
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics.recentTests.length === 0 ? (
                        <p className="text-muted-foreground">No recent tests found</p>
                      ) : (
                        <div className="space-y-4">
                          {analytics.recentTests.slice(0, 5).map((test) => (
                            <div key={test._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                              <div>
                                <h4 className="font-medium">{test.testDetails.testName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(test.createdAt), "PPP")}
                                </p>
                              </div>
                              <Badge className={getScoreBadge(test.percentageScore)}>
                                {Math.round(test.percentageScore)}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>
          
          {/* Test Details Tab */}
          <TabsContent value="details">
            {!selectedTest ? (
              <div className="text-center py-12">
                <p>Select a test from the history tab to view details</p>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <CardTitle>{selectedTest.testResult.testName}</CardTitle>
                          <CardDescription>
                            Taken on {format(new Date(selectedTest.testResult.createdAt), "PPP 'at' p")}
                          </CardDescription>
                        </div>
                        <Badge className={getScoreBadge(selectedTest.testResult.percentageScore)} className="text-lg px-3 py-1">
                          {Math.round(selectedTest.testResult.percentageScore)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Score</span>
                          <span className="text-xl font-medium">
                            {selectedTest.testResult.score} / {selectedTest.testResult.totalQuestions}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Time Taken</span>
                          <span className="text-xl font-medium">
                            {formatDuration(selectedTest.testResult.timeTaken)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Date</span>
                          <span className="text-xl font-medium">
                            {format(new Date(selectedTest.testResult.createdAt), "PPP")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Topic Performance</CardTitle>
                      <CardDescription>
                        Your performance broken down by topic
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedTest.topicPerformance.map((topic, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{topic.topic}</span>
                              <span className={getScoreColor(topic.percentage)}>
                                {topic.correctAnswers} / {topic.totalQuestions} ({topic?.percentage?.toFixed(1)}%)
                              </span>
                            </div>
                            <Progress value={topic.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
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
                      <div className="space-y-4">
                        {selectedTest.recommendations.map((rec, index) => (
                          <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                            {rec.topic ? (
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <BarChart2 className="h-4 w-4 text-primary" />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <AlertTriangle className="h-4 w-4 text-blue-500" />
                              </div>
                            )}
                            <div>
                              {rec.topic && (
                                <h4 className="font-medium">{rec.topic}</h4>
                              )}
                              <p className="text-sm text-muted-foreground">{rec.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("history")}>
                    Back to History
                  </Button>
                  <Button onClick={() => router.push(`/test`)}>
                    Take Another Test
                  </Button>
                </div>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestHistoryPage;