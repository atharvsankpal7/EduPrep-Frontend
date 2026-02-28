"use client";

import { useMemo } from "react";
import { Check, Clock3, Eye, Bookmark, HelpCircle } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EngineTest } from "@/types/global/interface/test.apiInterface";
import type { QuestionVisualState } from "@/hooks/use-test-engine";

interface TestOverviewDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    test: EngineTest;
    currentSectionIndex: number;
    answers: Record<string, number>;
    visited: Record<string, boolean>;
    markedForReview: Record<string, boolean>;
}

interface SectionSummary {
    name: string;
    total: number;
    answered: number;
    visited: number;
    review: number;
    notVisited: number;
    isCurrent: boolean;
}

export function TestOverviewDrawer({
    open,
    onOpenChange,
    test,
    currentSectionIndex,
    answers,
    visited,
    markedForReview,
}: TestOverviewDrawerProps) {
    const sections = useMemo<SectionSummary[]>(() => {
        return test.sections.map((section, sectionIndex) => {
            let answered = 0;
            let visitedCount = 0;
            let review = 0;
            let notVisited = 0;

            for (const q of section.questions) {
                const isAnswered = answers[q.id] !== undefined;
                const isVisited = visited[q.id] === true;
                const isReview = markedForReview[q.id] === true;

                if (isReview) review++;
                if (isAnswered) answered++;
                else if (isVisited) visitedCount++;
                else notVisited++;
            }

            return {
                name: section.sectionName,
                total: section.questions.length,
                answered,
                visited: visitedCount,
                review,
                notVisited,
                isCurrent: sectionIndex === currentSectionIndex,
            };
        });
    }, [test, currentSectionIndex, answers, visited, markedForReview]);

    const totals = useMemo(() => {
        return sections.reduce(
            (acc, s) => ({
                total: acc.total + s.total,
                answered: acc.answered + s.answered,
                review: acc.review + s.review,
                notVisited: acc.notVisited + s.notVisited,
            }),
            { total: 0, answered: 0, review: 0, notVisited: 0 }
        );
    }, [sections]);

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Test Overview</DrawerTitle>
                    <DrawerDescription>
                        {totals.answered} of {totals.total} questions answered
                    </DrawerDescription>
                </DrawerHeader>

                <ScrollArea className="flex-1 px-4 pb-6">
                    {/* Overall summary mini-cards */}
                    <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <SummaryCard
                            icon={<Check className="size-4" />}
                            label="Answered"
                            value={totals.answered}
                            colorClass="text-[hsl(var(--status-answered-text))] bg-[hsl(var(--status-answered-bg))]"
                        />
                        <SummaryCard
                            icon={<Bookmark className="size-4" />}
                            label="Review"
                            value={totals.review}
                            colorClass="text-[hsl(var(--status-review-text))] bg-[hsl(var(--status-review-bg))]"
                        />
                        <SummaryCard
                            icon={<Eye className="size-4" />}
                            label="Visited"
                            value={totals.total - totals.answered - totals.notVisited}
                            colorClass="text-[hsl(var(--status-unanswered-text))] bg-[hsl(var(--status-unanswered-bg))]"
                        />
                        <SummaryCard
                            icon={<HelpCircle className="size-4" />}
                            label="Not Visited"
                            value={totals.notVisited}
                            colorClass="text-muted-foreground bg-muted"
                        />
                    </div>

                    {/* Per-section breakdown */}
                    <div className="space-y-3">
                        {sections.map((section) => (
                            <div
                                key={section.name}
                                className={`rounded-lg border p-3 transition-colors ${section.isCurrent
                                        ? "border-[hsl(var(--blue-primary)/0.3)] bg-[hsl(var(--blue-primary)/0.04)]"
                                        : "border-border bg-card"
                                    }`}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-foreground">
                                        {section.name}
                                    </h4>
                                    {section.isCurrent && (
                                        <span className="rounded-md bg-[hsl(var(--blue-primary))] px-2 py-0.5 text-[0.625rem] font-semibold text-white">
                                            CURRENT
                                        </span>
                                    )}
                                </div>

                                {/* Progress bar */}
                                <div className="te-progress-track mb-2">
                                    <div
                                        className="te-progress-fill"
                                        style={{
                                            width: `${section.total > 0
                                                    ? (section.answered / section.total) * 100
                                                    : 0
                                                }%`,
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-4 text-[0.6875rem] text-muted-foreground">
                                    <span>
                                        <strong className="text-foreground">
                                            {section.answered}
                                        </strong>
                                        /{section.total} answered
                                    </span>
                                    {section.review > 0 && (
                                        <span className="text-[hsl(var(--status-review-text))]">
                                            {section.review} marked
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="border-t border-border p-4">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                            Close Overview
                        </Button>
                    </DrawerClose>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function SummaryCard({
    icon,
    label,
    value,
    colorClass,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    colorClass: string;
}) {
    return (
        <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 ${colorClass}`}
        >
            {icon}
            <div>
                <p className="text-lg font-bold tabular-nums leading-tight">{value}</p>
                <p className="text-[0.625rem] font-medium opacity-80">{label}</p>
            </div>
        </div>
    );
}
