"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import {
    TestHistoryCard,
    DashboardFilters,
    DashboardStats,
    DashboardSkeleton,
    DashboardEmptyState,
} from "@/components/dashboard";
import type {
    TestTypeFilter,
    SortByOption,
    SortOrder,
} from "@/components/dashboard/dashboard-filters";
import { useTestHistory } from "@/lib/api/hooks/useTestHistory";

const ITEMS_PER_PAGE = 9;

export default function DashboardPage() {
    // ─── Filter State ────────────────────────────────────────
    const [testType, setTestType] = useState<TestTypeFilter>("all");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortByOption>("attemptedAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [page, setPage] = useState(1);

    // Reset page on filter change
    const handleTestTypeChange = useCallback((v: TestTypeFilter) => {
        setTestType(v);
        setPage(1);
    }, []);

    const handleSearchChange = useCallback((v: string) => {
        setSearch(v);
        setPage(1);
    }, []);

    const handleSortByChange = useCallback((v: SortByOption) => {
        setSortBy(v);
        setPage(1);
    }, []);

    const handleSortOrderChange = useCallback((v: SortOrder) => {
        setSortOrder(v);
    }, []);

    const clearFilters = useCallback(() => {
        setTestType("all");
        setSearch("");
        setSortBy("attemptedAt");
        setSortOrder("desc");
        setPage(1);
    }, []);

    // ─── Query ───────────────────────────────────────────────
    const filters = useMemo(
        () => ({
            testType: testType === "all" ? undefined : testType,
            search: search || undefined,
            sortBy,
            sortOrder,
            page,
            limit: ITEMS_PER_PAGE,
        }),
        [testType, search, sortBy, sortOrder, page]
    );

    const { data, isLoading, isError } = useTestHistory(filters);

    const hasFilters = testType !== "all" || search.length > 0;
    const tests = data?.tests ?? [];
    const totalPages = data?.pagination?.totalPages ?? 1;
    const totalCount = data?.pagination?.total ?? 0;

    // ─── Render ──────────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="container py-6 pb-12 max-w-7xl">
                {/* ─── Page Header ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-3 mb-1.5">
                        <div className="p-2 rounded-lg bg-muted">
                            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground leading-tight">
                                My Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Review your test history and track your performance
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Loading State ────────────────────────────────── */}
                {isLoading && <DashboardSkeleton />}

                {/* ─── Error State ──────────────────────────────────── */}
                {isError && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center py-16"
                    >
                        <p className="text-sm text-muted-foreground mb-4">
                            Something went wrong while loading your test history.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm text-primary hover:underline"
                        >
                            Try again
                        </button>
                    </motion.div>
                )}

                {/* ─── Loaded State ─────────────────────────────────── */}
                {!isLoading && !isError && (
                    <div className="space-y-6">
                        {/* Stats Bar */}
                        <DashboardStats tests={tests} total={totalCount} />

                        {/* Filters */}
                        <DashboardFilters
                            testType={testType}
                            onTestTypeChange={handleTestTypeChange}
                            search={search}
                            onSearchChange={handleSearchChange}
                            sortBy={sortBy}
                            onSortByChange={handleSortByChange}
                            sortOrder={sortOrder}
                            onSortOrderChange={handleSortOrderChange}
                        />

                        {/* Results Info */}
                        {tests.length > 0 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Showing{" "}
                                    <span className="font-medium text-foreground">
                                        {(page - 1) * ITEMS_PER_PAGE + 1}–
                                        {Math.min(page * ITEMS_PER_PAGE, totalCount)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium text-foreground">
                                        {totalCount}
                                    </span>{" "}
                                    tests
                                </p>
                            </div>
                        )}

                        {/* Card Grid */}
                        {tests.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {tests.map((entry, i) => (
                                    <TestHistoryCard
                                        key={entry.id}
                                        entry={entry}
                                        index={i}
                                    />
                                ))}
                            </div>
                        ) : (
                            <DashboardEmptyState
                                hasFilters={hasFilters}
                                onClearFilters={clearFilters}
                            />
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pt-2">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
