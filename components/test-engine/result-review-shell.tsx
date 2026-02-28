"use client";

import { useState, useMemo, useCallback } from "react";
import {
    ArrowLeft,
    Check,
    ChevronLeft,
    ChevronRight,
    X,
    Minus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
    TEHeader,
    TEContainer,
    TEFooter,
    TEOptionCard,
    TEKbd,
    TEGridButton,
} from "@/components/test-engine/te-primitives";
import { RenderableContent } from "@/components/test-engine/renderable-content";
import { getRenderableContent } from "@/lib/test-engine/content";
import type {
    TestResultData,
    QuestionAnalysisItem,
} from "@/types/global/interface/test.apiInterface";

/* ═══════════════════════════════════════════════════════════
 * Result Review Shell
 * Read-only test review using the same visual language as the
 * test engine. Reuses TE primitives — no questions are
 * interactive.
 * ═══════════════════════════════════════════════════════════ */

interface ResultReviewShellProps {
    result: TestResultData;
    testName?: string;
}

type QuestionResultStatus = "correct" | "incorrect" | "skipped";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

const getQuestionResultStatus = (
    q: QuestionAnalysisItem
): QuestionResultStatus => {
    if (q.selectedOption === -1 || q.selectedOption === undefined) return "skipped";
    return q.isCorrect ? "correct" : "incorrect";
};

const getOptionResultState = (
    optionIndex: number,
    correctOption: number,
    selectedOption: number
): "correct" | "incorrect" | "neutral" => {
    if (optionIndex === correctOption) return "correct";
    if (optionIndex === selectedOption && selectedOption !== correctOption)
        return "incorrect";
    return "neutral";
};

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0)
        return `${mins}m ${secs.toString().padStart(2, "0")}s`;
    return `${secs}s`;
}

export function ResultReviewShell({
    result,
    testName,
}: ResultReviewShellProps) {
    const questions = result.questionAnalysis ?? [];
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentQuestion = questions[currentIndex] ?? null;
    const isFirstQuestion = currentIndex <= 0;
    const isLastQuestion = currentIndex >= questions.length - 1;

    const questionStatuses = useMemo<QuestionResultStatus[]>(
        () => questions.map(getQuestionResultStatus),
        [questions]
    );

    const score = result.totalQuestions > 0
        ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)
        : "0";

    const goPrevious = useCallback(() => {
        setCurrentIndex((i) => Math.max(0, i - 1));
    }, []);

    const goNext = useCallback(() => {
        setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
    }, [questions.length]);

    const jumpTo = useCallback((index: number) => {
        setCurrentIndex(Math.max(0, Math.min(index, questions.length - 1)));
    }, [questions.length]);

    // Arrow key navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrevious();
            }
        },
        [goNext, goPrevious]
    );

    // ─── No questions available ─────────────────────────────
    if (questions.length === 0) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-10" tabIndex={0} onKeyDown={handleKeyDown}>
                <TEHeader>
                    <TEContainer className="py-3">
                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" size="icon" className="size-8">
                                <Link href="/test" aria-label="Back to tests">
                                    <ArrowLeft className="size-4" />
                                </Link>
                            </Button>
                            <h1 className="text-sm font-semibold text-foreground md:text-base">
                                {testName ?? "Test Result"}
                            </h1>
                        </div>
                    </TEContainer>
                </TEHeader>

                {/* Score summary */}
                <ResultSummaryBar result={result} score={score} />

                <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
                    Detailed question analysis is not available for this result.
                </div>

                <div className="mt-6 flex justify-center">
                    <Button asChild>
                        <Link href="/test">Take Another Test</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // ─── Main review interface ──────────────────────────────
    return (
        <div tabIndex={0} onKeyDown={handleKeyDown} className="outline-none">
            {/* ── Glass header ── */}
            <TEHeader>
                <TEContainer className="py-2.5 sm:py-3">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon" className="size-8">
                            <Link href="/test" aria-label="Back to tests">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div className="min-w-0 flex-1">
                            <h1 className="truncate text-sm font-semibold text-foreground md:text-base">
                                {testName ?? "Test Result"}
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {result.correctAnswers}/{result.totalQuestions} correct
                                {" · "}
                                <span className="font-semibold">{score}%</span>
                                {" · "}
                                {formatTime(result.timeSpent)}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className="tabular-nums text-xs font-medium"
                        >
                            Q {currentIndex + 1}/{questions.length}
                        </Badge>
                    </div>
                </TEContainer>
            </TEHeader>

            {/* ── Content area ── */}
            <TEContainer className="py-4 pb-24 md:py-6 md:pb-28">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
                    {/* Question panel — read only */}
                    {currentQuestion && (
                        <ReviewQuestionPanel
                            question={currentQuestion}
                            questionNumber={currentIndex + 1}
                        />
                    )}

                    {/* Question grid */}
                    <ReviewQuestionGrid
                        totalQuestions={questions.length}
                        currentIndex={currentIndex}
                        questionStatuses={questionStatuses}
                        onSelectQuestion={jumpTo}
                    />
                </div>
            </TEContainer>

            {/* ── Navigation footer ── */}
            <TEFooter>
                <TEContainer className="flex items-center justify-between gap-4 px-2 sm:px-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isFirstQuestion}
                        onClick={goPrevious}
                        className="gap-1 min-h-[44px] min-w-[44px]"
                        aria-label="Previous question"
                    >
                        <ChevronLeft className="size-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {isLastQuestion ? (
                            <Button asChild size="sm" className="gap-1.5 font-semibold min-h-[44px]">
                                <Link href="/test">
                                    Done
                                    <ArrowLeft className="size-4 rotate-180" />
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="sm"
                                onClick={goNext}
                                className="gap-1.5 bg-[hsl(var(--blue-primary))] font-semibold text-white hover:bg-[hsl(var(--blue-dark))] min-h-[44px]"
                                aria-label="Next question"
                            >
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        )}
                    </div>
                </TEContainer>
            </TEFooter>
        </div>
    );
}

/* ───────────────────────────────────────────────────────────
 * Score summary bar
 * ─────────────────────────────────────────────────────────── */

function ResultSummaryBar({
    result,
    score,
}: {
    result: TestResultData;
    score: string;
}) {
    const incorrect = result.totalQuestions - result.correctAnswers;
    const skipped =
        (result.questionAnalysis ?? []).filter(
            (q) => q.selectedOption === -1 || q.selectedOption === undefined
        ).length;

    return (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <SummaryCard
                icon={<Check className="size-4" />}
                label="Correct"
                value={result.correctAnswers}
                colorClass="text-[hsl(var(--status-answered-text))] bg-[hsl(var(--status-answered-bg))]"
            />
            <SummaryCard
                icon={<X className="size-4" />}
                label="Incorrect"
                value={incorrect - skipped}
                colorClass="text-[hsl(var(--status-unanswered-text))] bg-[hsl(var(--status-unanswered-bg))]"
            />
            <SummaryCard
                icon={<Minus className="size-4" />}
                label="Skipped"
                value={skipped}
                colorClass="text-muted-foreground bg-muted"
            />
            <SummaryCard
                label="Score"
                value={`${score}%`}
                colorClass="text-[hsl(var(--blue-primary))] bg-[hsl(var(--blue-primary)/0.08)]"
            />
        </div>
    );
}

function SummaryCard({
    icon,
    label,
    value,
    colorClass,
}: {
    icon?: React.ReactNode;
    label: string;
    value: number | string;
    colorClass: string;
}) {
    return (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${colorClass}`}>
            {icon}
            <div>
                <p className="text-lg font-bold tabular-nums leading-tight">{value}</p>
                <p className="text-[0.625rem] font-medium opacity-80">{label}</p>
            </div>
        </div>
    );
}

/* ───────────────────────────────────────────────────────────
 * Review Question Panel (read-only)
 * ─────────────────────────────────────────────────────────── */

function ReviewQuestionPanel({
    question,
    questionNumber,
}: {
    question: QuestionAnalysisItem;
    questionNumber: number;
}) {
    const questionTextMode = getRenderableContent(question.questionText).kind;
    const status = getQuestionResultStatus(question);

    const statusBadge = (() => {
        switch (status) {
            case "correct":
                return (
                    <Badge className="gap-1 bg-[hsl(var(--status-answered-bg))] text-[hsl(var(--status-answered-text))] border border-[hsl(var(--status-answered-border))] hover:bg-[hsl(var(--status-answered-bg))]">
                        <Check className="size-3" />
                        Correct
                    </Badge>
                );
            case "incorrect":
                return (
                    <Badge className="gap-1 bg-[hsl(var(--status-unanswered-bg))] text-[hsl(var(--status-unanswered-text))] border border-[hsl(var(--status-unanswered-border))] hover:bg-[hsl(var(--status-unanswered-bg))]">
                        <X className="size-3" />
                        Incorrect
                    </Badge>
                );
            case "skipped":
                return (
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                        <Minus className="size-3" />
                        Skipped
                    </Badge>
                );
        }
    })();

    return (
        <div className="min-w-0 flex-1">
            <div className="rounded-xl border border-border bg-card p-6 md:p-10">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="tabular-nums text-xs font-semibold">
                            Question {questionNumber}
                        </Badge>
                        {statusBadge}
                    </div>
                </div>

                {/* Question text */}
                <div className="mx-auto mb-8 max-w-[72ch]">
                    <div className="text-base leading-[1.7] text-foreground md:text-lg">
                        <RenderableContent
                            value={question.questionText}
                            altText={`Question ${questionNumber}`}
                        />
                    </div>
                </div>

                {/* Options — read-only with correct/incorrect indicators */}
                <div className="mx-auto max-w-[72ch] space-y-4">
                    {question.options.map((option, optionIndex) => {
                        const label = OPTION_LABELS[optionIndex] ?? `${optionIndex + 1}`;
                        const resultState = getOptionResultState(
                            optionIndex,
                            question.correctOption,
                            question.selectedOption
                        );
                        const isCorrectOption = optionIndex === question.correctOption;
                        const isUserPick = optionIndex === question.selectedOption;

                        return (
                            <TEOptionCard
                                key={`result-opt-${optionIndex}`}
                                disabled
                                data-result={resultState}
                                tabIndex={-1}
                                aria-label={`Option ${label}${isCorrectOption ? ", correct answer" : ""}${isUserPick ? ", your answer" : ""}`}
                            >
                                <TEKbd>{label}</TEKbd>

                                <Label className="flex-1 text-sm leading-relaxed text-foreground">
                                    <RenderableContent
                                        value={option}
                                        altText={`Option ${label}`}
                                        className="text-pretty"
                                        imageClassName="max-h-48"
                                    />
                                </Label>

                                {/* Indicator icon */}
                                {isCorrectOption && (
                                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--status-answered-text))]">
                                        <Check className="size-3 text-white" />
                                    </div>
                                )}
                                {isUserPick && !isCorrectOption && (
                                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--status-unanswered-text))]">
                                        <X className="size-3 text-white" />
                                    </div>
                                )}
                            </TEOptionCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ───────────────────────────────────────────────────────────
 * Review Question Grid
 * ─────────────────────────────────────────────────────────── */

const RESULT_LEGEND: { label: string; status: string }[] = [
    { label: "Correct", status: "correct" },
    { label: "Incorrect", status: "incorrect" },
    { label: "Skipped", status: "skipped" },
];

function ReviewQuestionGrid({
    totalQuestions,
    currentIndex,
    questionStatuses,
    onSelectQuestion,
}: {
    totalQuestions: number;
    currentIndex: number;
    questionStatuses: QuestionResultStatus[];
    onSelectQuestion: (index: number) => void;
}) {
    return (
        <aside
            className="flex flex-col rounded-xl border border-border bg-card"
            aria-label="Question navigation palette"
        >
            <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">
                    Question Map
                </h3>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    Review any question
                </p>
            </div>

            <ScrollArea className="flex-1 px-4 py-3">
                <div
                    className="grid grid-cols-5 gap-2.5"
                    role="group"
                    aria-label="Question grid"
                >
                    {Array.from({ length: totalQuestions }).map((_, index) => {
                        const status = questionStatuses[index] ?? "skipped";
                        const isCurrent = index === currentIndex;

                        return (
                            <TEGridButton
                                key={`rg-${index}`}
                                onClick={() => onSelectQuestion(index)}
                                status={status}
                                current={isCurrent}
                                aria-label={`Question ${index + 1}, ${status}${isCurrent ? ", current" : ""}`}
                                aria-current={isCurrent ? "true" : undefined}
                            >
                                {index + 1}
                            </TEGridButton>
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="border-t border-border px-4 py-3">
                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                    {RESULT_LEGEND.map((item) => (
                        <div key={item.status} className="te-legend-item">
                            <TEGridButton
                                status={item.status}
                                className="!w-3.5 !h-3.5 text-[0px]"
                                aria-hidden="true"
                            />
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
