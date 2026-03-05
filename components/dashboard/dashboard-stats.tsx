"use client";

import { motion } from "framer-motion";
import { ClipboardList, TrendingUp, Clock, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { TestHistoryEntry } from "@/types/global/interface/test-history.interface";

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    index: number;
}

const statsVariant = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
};

function StatsCard({ title, value, subtitle, icon: Icon, index }: StatsCardProps) {
    return (
        <motion.div variants={statsVariant} initial="hidden" animate="visible" custom={index}>
            <Card className="border bg-card p-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-md border bg-muted/40 p-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {title}
                        </p>
                        <p className="text-lg font-semibold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

interface DashboardStatsProps {
    tests: TestHistoryEntry[];
    total: number;
}

export function DashboardStats({ tests, total }: DashboardStatsProps) {
    const totalTests = total;
    const avgScore =
        tests.length > 0
            ? Math.round(tests.reduce((sum, t) => sum + Number(t.score), 0) / tests.length)
            : 0;
    const totalTime = tests.reduce((sum, t) => sum + Number(t.timeTaken), 0);
    const bestScore =
        tests.length > 0 ? Math.round(Math.max(...tests.map((t) => Number(t.score)))) : 0;

    const statsCards: Omit<StatsCardProps, "index">[] = [
        {
            title: "Total Tests",
            value: totalTests,
            subtitle: "Attempts recorded",
            icon: ClipboardList,
        },
        {
            title: "Average Score",
            value: `${avgScore}%`,
            subtitle: "Across visible results",
            icon: TrendingUp,
        },
        {
            title: "Time Spent",
            value: formatDuration(totalTime),
            subtitle: "Total duration",
            icon: Clock,
        },
        {
            title: "Best Score",
            value: `${bestScore}%`,
            subtitle: "Highest result",
            icon: Target,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statsCards.map((card, i) => (
                <StatsCard key={card.title} {...card} index={i} />
            ))}
        </div>
    );
}
