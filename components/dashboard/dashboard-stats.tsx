"use client";

import { motion } from "framer-motion";
import {
    ClipboardList,
    TrendingUp,
    Clock,
    Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { TestHistoryEntry } from "@/types/global/interface/test-history.interface";

// ─── Helpers ──────────────────────────────────────────────────────────────

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
    iconBg: string;
    iconColor: string;
    index: number;
}

const statsVariant = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.3 },
    }),
};

function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
    index,
}: StatsCardProps) {
    return (
        <motion.div
            variants={statsVariant}
            initial="hidden"
            animate="visible"
            custom={index}
        >
            <Card className="p-4 border bg-card hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2.5 ${iconBg}`}>
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                            {title}
                        </p>
                        <p className="text-xl font-bold text-foreground tabular-nums leading-tight">
                            {value}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────

interface DashboardStatsProps {
    tests: TestHistoryEntry[];
    total: number;
}

export function DashboardStats({ tests, total }: DashboardStatsProps) {
    // Compute aggregate metrics
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
            subtitle: "Tests attempted",
            icon: ClipboardList,
            iconBg: "bg-muted",
            iconColor: "text-muted-foreground",
        },
        {
            title: "Avg Score",
            value: `${avgScore}%`,
            subtitle: "Across all tests",
            icon: TrendingUp,
            iconBg: "bg-muted",
            iconColor: "text-muted-foreground",
        },
        {
            title: "Time Spent",
            value: formatDuration(totalTime),
            subtitle: "Total practice time",
            icon: Clock,
            iconBg: "bg-muted",
            iconColor: "text-muted-foreground",
        },
        {
            title: "Best Score",
            value: `${bestScore}%`,
            subtitle: "Personal best",
            icon: Target,
            iconBg: "bg-muted",
            iconColor: "text-muted-foreground",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statsCards.map((card, i) => (
                <StatsCard key={card.title} {...card} index={i} />
            ))}
        </div>
    );
}
