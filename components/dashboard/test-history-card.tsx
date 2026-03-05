"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, Calendar, ArrowRight, Target, BookOpen, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type {
    TestHistoryEntry,
    TestType,
    TestStatus,
} from "@/types/global/interface/test-history.interface";

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

const testTypeConfig: Record<TestType, { label: string; icon: React.ElementType }> = {
    custom: {
        label: "Custom",
        icon: Target,
    },
    cet: {
        label: "CET",
        icon: BookOpen,
    },
};

const statusConfig: Record<TestStatus, { label: string; tone: string }> = {
    completed: {
        label: "Completed",
        tone: "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300",
    },
    submitted: {
        label: "Submitted",
        tone: "border-border bg-muted text-foreground",
    },
    auto_submitted: {
        label: "Auto-submitted",
        tone: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    },
};

function getScoreTone(score: number): string {
    if (score >= 80) return "text-green-700 dark:text-green-300";
    if (score >= 50) return "text-amber-700 dark:text-amber-300";
    return "text-red-700 dark:text-red-300";
}

interface TestHistoryCardProps {
    entry: TestHistoryEntry;
    index: number;
}

const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.04,
            duration: 0.25,
        },
    }),
};

export function TestHistoryCard({ entry, index }: TestHistoryCardProps) {
    const typeConfig = testTypeConfig[entry.testType];
    const stConfig = statusConfig[entry.status];
    const TypeIcon = typeConfig.icon;

    const scorePercentage = Math.round(Number(entry.score));
    const scoreTone = getScoreTone(scorePercentage);

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={index}>
            <Card className="border bg-card p-4" id={`test-history-card-${entry.id}`}>
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-foreground">{entry.testName}</h3>
                        <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <TypeIcon className="h-3.5 w-3.5" />
                            {typeConfig.label}
                        </div>
                    </div>

                    <Badge className={`border px-2 py-0.5 text-[10px] font-medium ${stConfig.tone}`}>
                        {stConfig.label}
                    </Badge>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(entry.attemptedAt)}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {formatDate(entry.attemptedAt)} at {formatTime(entry.attemptedAt)}
                        </TooltipContent>
                    </Tooltip>

                    <span className="inline-flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {entry.totalQuestions} Qs
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5" />
                        {formatDuration(entry.timeTaken)}
                    </span>
                </div>

                {entry.testType === "custom" && entry.topics.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {entry.topics.slice(0, 4).map((topic) => (
                            <span
                                key={topic}
                                className="inline-flex items-center rounded-md border bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                                {topic}
                            </span>
                        ))}
                        {entry.topics.length > 4 && (
                            <span className="inline-flex items-center rounded-md border bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground">
                                +{entry.topics.length - 4}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between border-t pt-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className={`text-sm font-semibold ${scoreTone}`}>
                            {scorePercentage}%
                            <span className="ml-1 text-muted-foreground">
                                ({entry.correctAnswers}/{entry.totalQuestions})
                            </span>
                        </p>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs" id={`view-result-${entry.id}`}>
                        <Link href={`/result/${entry.resultId}`}>
                            View result
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
