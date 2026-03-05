"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    HelpCircle,
    Calendar,
    ArrowRight,
    Target,
    BookOpen,
    Zap,
    Timer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
    TestHistoryEntry,
    TestType,
    TestStatus,
} from "@/types/global/interface/test-history.interface";

// ─── Helpers ──────────────────────────────────────────────────────────────

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

const testTypeConfig: Record<
    TestType,
    { label: string; icon: React.ElementType; colorClass: string; bgClass: string }
> = {
    custom: {
        label: "Custom Test",
        icon: Target,
        colorClass: "text-[hsl(var(--ginger-primary))]",
        bgClass: "bg-[hsl(var(--ginger-primary)/0.1)]",
    },
    cet: {
        label: "CET Test",
        icon: BookOpen,
        colorClass: "text-[hsl(var(--accent-cool))]",
        bgClass: "bg-[hsl(var(--accent-cool)/0.1)]",
    },
};

const statusConfig: Record<
    TestStatus,
    { label: string; colorClass: string; bgClass: string }
> = {
    completed: {
        label: "Completed",
        colorClass: "text-[hsl(var(--status-answered-text))]",
        bgClass: "bg-[hsl(var(--status-answered-bg))] border-[hsl(var(--status-answered-border))]",
    },
    submitted: {
        label: "Submitted",
        colorClass: "text-[hsl(var(--blue-primary))]",
        bgClass: "bg-[hsl(var(--blue-primary)/0.08)] border-[hsl(var(--blue-primary)/0.2)]",
    },
    auto_submitted: {
        label: "Auto-Submitted",
        colorClass: "text-[hsl(var(--status-warning-text))]",
        bgClass: "bg-[hsl(var(--status-warning-bg))] border-[hsl(var(--status-warning-border))]",
    },
};

function getScoreColor(score: number): string {
    if (score >= 80) return "text-[hsl(var(--status-answered-text))]";
    if (score >= 50) return "text-[hsl(var(--accent-warm))]";
    return "text-[hsl(var(--status-unanswered-text))]";
}

function getScoreBgColor(score: number): string {
    if (score >= 80) return "bg-[hsl(var(--status-answered-bg))]";
    if (score >= 50) return "bg-[hsl(var(--status-warning-bg))]";
    return "bg-[hsl(var(--status-unanswered-bg))]";
}

// ─── Component ────────────────────────────────────────────────────────────

interface TestHistoryCardProps {
    entry: TestHistoryEntry;
    index: number;
}

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

export function TestHistoryCard({ entry, index }: TestHistoryCardProps) {
    const typeConfig = testTypeConfig[entry.testType];
    const stConfig = statusConfig[entry.status];
    const TypeIcon = typeConfig.icon;

    const scorePercentage = Math.round(Number(entry.score));
    const scoreColor = getScoreColor(scorePercentage);
    const scoreBg = getScoreBgColor(scorePercentage);

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
        >
            <Card
                className="group relative overflow-hidden border bg-card transition-all duration-300
                   hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5"
                id={`test-history-card-${entry.id}`}
            >
                {/* Top accent bar */}
                <div
                    className={`absolute top-0 left-0 right-0 h-[2px] opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${scorePercentage >= 80
                        ? "bg-gradient-to-r from-[hsl(var(--status-answered-text))] to-[hsl(var(--status-answered-border))]"
                        : scorePercentage >= 50
                            ? "bg-gradient-warm"
                            : "bg-gradient-to-r from-[hsl(var(--status-unanswered-text))] to-[hsl(var(--status-unanswered-border))]"
                        }`}
                />

                <div className="p-5">
                    {/* ─── Header Row: Test Type + Status ─────────────────── */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div
                                className={`flex-shrink-0 rounded-lg p-2 ${typeConfig.bgClass}`}
                            >
                                <TypeIcon className={`h-4 w-4 ${typeConfig.colorClass}`} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
                                    {entry.testName}
                                </h3>
                                <span
                                    className={`text-xs font-medium ${typeConfig.colorClass}`}
                                >
                                    {typeConfig.label}
                                </span>
                            </div>
                        </div>

                        <Badge
                            className={`text-[10px] font-semibold px-2 py-0.5 border ${stConfig.bgClass} ${stConfig.colorClass} shrink-0`}
                        >
                            {stConfig.label}
                        </Badge>
                    </div>

                    {/* ─── Meta Row: Date, Questions, Time ────────────────── */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3.5">
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

                    {/* ─── Topics (only for custom tests) ──────────────────── */}
                    {entry.testType === "custom" && entry.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3.5">
                            {entry.topics.slice(0, 4).map((topic) => (
                                <span
                                    key={topic}
                                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                >
                                    <Zap className="h-2.5 w-2.5" />
                                    {topic}
                                </span>
                            ))}
                            {entry.topics.length > 4 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground cursor-default">
                                            +{entry.topics.length - 4} more
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[240px]">
                                        <p className="text-xs">{entry.topics.slice(4).join(", ")}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    )}

                    {/* ─── Score + CTA Row ──────────────────────────────────── */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                        <div className="flex items-center gap-3">
                            {/* Score circle */}
                            <div
                                className={`flex items-center justify-center w-11 h-11 rounded-full ${scoreBg}`}
                            >
                                <span className={`text-sm font-bold ${scoreColor}`}>
                                    {scorePercentage}%
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Score</p>
                                <p className="text-sm font-semibold text-foreground">
                                    {entry.correctAnswers}/{entry.totalQuestions}
                                </p>
                            </div>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="group/btn transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                            id={`view-result-${entry.id}`}
                        >
                            <Link href={`/result/${entry.resultId}`}>
                                View Result
                                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
